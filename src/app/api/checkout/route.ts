import { NextResponse } from "next/server";
import { buildWhatsappUrl, buildOrderMessage } from "@/lib/whatsapp";
import { buildWompiCheckoutUrl } from "@/lib/wompi";
import { checkoutSchema, createOrderReference, getCheckoutTotals, normalizeCartItems } from "@/lib/checkout";
import { saveOrder } from "@/lib/order-store";
import { WHOLESALE_MIN_UNITS } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = checkoutSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Revisa tus datos: falta información para crear el pedido.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const items = normalizeCartItems(parsed.data.items, parsed.data.channel);
    if (!items.length) {
      return NextResponse.json({ ok: false, message: "El carrito no contiene productos válidos." }, { status: 400 });
    }

    if (parsed.data.channel === "wholesale") {
      const wholesaleUnits = items
        .filter((item) => item.channel === "wholesale")
        .reduce((sum, item) => sum + item.quantity, 0);

      if (wholesaleUnits < WHOLESALE_MIN_UNITS) {
        return NextResponse.json(
          {
            ok: false,
            message: `El pedido mayorista mínimo es de ${WHOLESALE_MIN_UNITS} unidades mezcladas.`,
          },
          { status: 400 },
        );
      }
    }

    const totals = getCheckoutTotals(items, parsed.data.city);
    const reference = createOrderReference(parsed.data.channel === "wholesale" ? "EE-MAY" : "EE");
    const siteUrl = new URL(request.url).origin;
    const checkoutUrl = buildWompiCheckoutUrl({
      reference,
      amountCop: totals.totalCop,
      customerEmail: parsed.data.email,
      siteUrl,
    });
    const whatsappUrl = buildWhatsappUrl(
      buildOrderMessage({
        reference,
        customer: parsed.data,
        items,
        totalCop: totals.totalCop,
        channel: parsed.data.channel,
      }),
    );
    const paymentProvider = checkoutUrl ? "wompi" : "manual";
    const paymentStatus = checkoutUrl ? "initiated" : "pending";
    const orderStatus = "pending";

    await saveOrder({
      reference,
      channel: parsed.data.channel,
      customer: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        city: parsed.data.city,
        address: parsed.data.address,
        notes: parsed.data.notes,
      },
      items,
      subtotalCop: totals.subtotalCop,
      shippingCop: totals.shippingCop,
      totalCop: totals.totalCop,
      freeShipping: totals.freeShipping,
      shippingZone: totals.shippingZone,
      paymentProvider,
      paymentStatus,
      orderStatus,
      wompiCheckoutUrl: checkoutUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      reference,
      nextAction: checkoutUrl ? "wompi" : "whatsapp",
      paymentProvider,
      paymentStatus,
      orderStatus,
      checkoutUrl,
      whatsappUrl,
      message: checkoutUrl
        ? "Pedido listo. Redirige a Wompi para pago seguro."
        : "Pedido listo. Te llevamos a WhatsApp para confirmar disponibilidad y forma de pago.",
      pricing: {
        subtotalCop: totals.subtotalCop,
        shippingCop: totals.shippingCop,
        totalCop: totals.totalCop,
        freeShipping: totals.freeShipping,
        shippingZone: totals.shippingZone,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No fue posible crear el checkout en este momento. Intenta por WhatsApp." },
      { status: 500 },
    );
  }
}
