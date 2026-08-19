import { formatCop } from "@/lib/currency";
import type { OrderRecord } from "@/types/order";

type OrderNotificationEvent = "order.created" | "order.payment_updated";

function getNotificationWebhook() {
  return process.env.ORDER_NOTIFICATION_WEBHOOK?.trim();
}

function getNotificationSecret() {
  return process.env.ORDER_NOTIFICATION_SECRET?.trim();
}

function buildOrderSummary(order: OrderRecord, event: OrderNotificationEvent) {
  const title = event === "order.created" ? "Nuevo pedido Empire Essence" : "Pago actualizado Empire Essence";
  const items = order.items
    .map((item) => `${item.productName} ${item.sizeMl}ml x${item.quantity} - ${formatCop(item.unitPriceCop * item.quantity)}`)
    .join("\n");

  return [
    title,
    `Referencia: ${order.reference}`,
    `Estado pago: ${order.paymentStatus}${order.wompiStatus ? ` (${order.wompiStatus})` : ""}`,
    `Estado pedido: ${order.orderStatus}`,
    `Total: ${formatCop(order.totalCop)}`,
    "",
    "Cliente:",
    `${order.customer.name}`,
    `Telefono: ${order.customer.phone}`,
    `Correo: ${order.customer.email}`,
    `Ciudad: ${order.customer.city}`,
    `Direccion: ${order.customer.address}`,
    order.customer.notes ? `Notas: ${order.customer.notes}` : "",
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

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Empire-Notification-Secret": secret } : {}),
      },
      body: JSON.stringify({
        event,
        text: buildOrderSummary(order, event),
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
