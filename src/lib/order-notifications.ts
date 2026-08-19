import { formatCop } from "@/lib/currency";
import type { OrderRecord } from "@/types/order";

type OrderNotificationEvent = "order.created" | "order.payment_updated";

function getNotificationWebhook() {
  return process.env.ORDER_NOTIFICATION_WEBHOOK?.trim();
}

function getNotificationSecret() {
  return process.env.ORDER_NOTIFICATION_SECRET?.trim();
}

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return siteUrl?.startsWith("https://") ? siteUrl.replace(/\/$/, "") : null;
}

function normalizePhoneForWhatsapp(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("57")) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

function buildCustomerWhatsappUrl(order: OrderRecord) {
  const phone = normalizePhoneForWhatsapp(order.customer.phone);
  if (!phone) return null;

  const message = [
    `Hola ${order.customer.name}, recibimos tu pedido Empire Essence.`,
    `Referencia: ${order.reference}`,
    `Total: ${formatCop(order.totalCop)}`,
    "",
    "Te escribimos para coordinar despacho y entrega.",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildOrderUrl(order: OrderRecord) {
  const siteUrl = getSiteUrl();
  return siteUrl ? `${siteUrl}/gracias?ref=${encodeURIComponent(order.reference)}` : null;
}

function getActionLabel(order: OrderRecord, event: OrderNotificationEvent) {
  if (order.paymentStatus === "paid") return "Preparar pedido y coordinar envio.";
  if (order.paymentStatus === "failed") return "Revisar pago fallido y contactar al cliente si conviene.";
  if (order.paymentProvider === "manual") return "Contactar al cliente por WhatsApp para cerrar pago manual.";
  if (event === "order.created") return "Esperar confirmacion Wompi antes de despachar.";
  return "Validar estado de pago antes de despachar.";
}

function buildOrderSummary(order: OrderRecord, event: OrderNotificationEvent) {
  const title =
    order.paymentStatus === "paid"
      ? "Pago confirmado Empire Essence"
      : event === "order.created"
        ? "Nuevo pedido Empire Essence"
        : "Pago actualizado Empire Essence";
  const items = order.items
    .map((item) => `${item.productName} ${item.sizeMl}ml x${item.quantity} - ${formatCop(item.unitPriceCop * item.quantity)}`)
    .join("\n");
  const customerWhatsappUrl = buildCustomerWhatsappUrl(order);
  const orderUrl = buildOrderUrl(order);

  return [
    title,
    `Referencia: ${order.reference}`,
    `Accion: ${getActionLabel(order, event)}`,
    `Estado pago: ${order.paymentStatus}${order.wompiStatus ? ` (${order.wompiStatus})` : ""}`,
    `Estado pedido: ${order.orderStatus}`,
    `Total: ${formatCop(order.totalCop)}`,
    orderUrl ? `Ver orden: ${orderUrl}` : "",
    "",
    "Cliente:",
    `${order.customer.name}`,
    `Telefono: ${order.customer.phone}`,
    `Correo: ${order.customer.email}`,
    `Ciudad: ${order.customer.city}`,
    `Direccion: ${order.customer.address}`,
    order.customer.notes ? `Notas: ${order.customer.notes}` : "",
    customerWhatsappUrl ? `WhatsApp cliente: ${customerWhatsappUrl}` : "",
    "",
    "Productos:",
    items,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyOrder(event: OrderNotificationEvent, order: OrderRecord) {
  const webhook = getNotificationWebhook();
  if (!webhook) return;

  const secret = getNotificationSecret();
  const customerWhatsappUrl = buildCustomerWhatsappUrl(order);
  const orderUrl = buildOrderUrl(order);

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Empire-Notification-Secret": secret } : {}),
      },
      body: JSON.stringify({
        event,
        action: getActionLabel(order, event),
        text: buildOrderSummary(order, event),
        links: {
          order: orderUrl,
          customerWhatsapp: customerWhatsappUrl,
          wompiCheckout: order.wompiCheckoutUrl ?? null,
        },
        order: {
          reference: order.reference,
          channel: order.channel,
          customer: order.customer,
          items: order.items,
          subtotalCop: order.subtotalCop,
          shippingCop: order.shippingCop,
          totalCop: order.totalCop,
          paymentProvider: order.paymentProvider,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          wompiStatus: order.wompiStatus ?? null,
          wompiTransactionId: order.wompiTransactionId ?? null,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
      }),
    });

    if (!response.ok) {
      console.error("Order notification webhook failed", {
        event,
        reference: order.reference,
        status: response.status,
      });
    }
  } catch (error) {
    console.error("Order notification webhook error", {
      event,
      reference: order.reference,
      error,
    });
  }
}
