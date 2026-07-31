import { NextResponse } from "next/server";
import {
  getWholesaleTier,
  scoreWholesaleLead,
  summarizeWholesaleKit,
  wholesaleQuoteSchema,
} from "@/lib/wholesale";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { formatCop } from "@/lib/currency";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = wholesaleQuoteSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Faltan datos para precalificar tu propuesta mayorista.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const kit = summarizeWholesaleKit(parsed.data.kit);
    const score = scoreWholesaleLead(parsed.data.lead, kit.totalUnits);
    const tier = getWholesaleTier(score);
    const needsQuote = Boolean(parsed.data.supplyNeeds?.length);

    const message = [
      "Hola Empire Essence. Quiero revisar una propuesta mayorista.",
      `Nombre: ${parsed.data.lead.name}`,
      `Ciudad: ${parsed.data.lead.city}`,
      `Tipo de negocio: ${parsed.data.lead.businessType}`,
      `Unidades fragancias: ${kit.totalUnits}`,
      `Inversión estimada: ${formatCop(kit.subtotalCop)}`,
      `Ganancia proyectada sugerida: ${formatCop(kit.projectedProfitCop)}`,
      needsQuote ? `Insumos por cotizar: ${parsed.data.supplyNeeds?.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return NextResponse.json({
      ok: true,
      score,
      tier,
      kit,
      needsQuote,
      whatsappUrl: buildWhatsappUrl(message),
      nextAction: needsQuote
        ? "Cotizar insumos por WhatsApp porque los precios por gramo/litro varían por volumen."
        : kit.valid
          ? "Puede pasar a checkout mayorista con precios fijos por unidad."
          : "Completa mínimo 10 unidades mezcladas para activar precio mayorista.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No fue posible calcular la propuesta mayorista." },
      { status: 500 },
    );
  }
}
