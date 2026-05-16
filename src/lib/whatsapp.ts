import type { CartItem } from "@/types/cart";
import type { CheckoutCustomer } from "@/types/checkout";
import { formatCop } from "@/lib/currency";

export function getWhatsappNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573156753404";
}

export function buildWhatsappUrl(message: string) {
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
}

export function buildAssistedCheckoutMessage({
  customer,
  items,
  subtotalCop,
  shippingCop,
  totalCop,
  freeShipping,
  channel,
}: {
  customer: Partial<CheckoutCustomer>;
  items: CartItem[];
  subtotalCop: number;
  shippingCop: number;
  totalCop: number;
  freeShipping: boolean;
  channel: "retail" | "wholesale";
}) {
  const lines = [
    `Hola Empire Essence. Quiero cerrar este pedido ${channel === "wholesale" ? "mayorista" : "retail"} por WhatsApp.`,
    "",
    "Productos:",
    ...items.map(
      (item) =>
        `- ${item.productName} ${item.sizeMl}ml x${item.quantity} - ${formatCop(item.unitPriceCop * item.quantity)}`,
    ),
    "",
    `Subtotal: ${formatCop(subtotalCop)}`,
    `Envio: ${freeShipping ? "Gratis" : formatCop(shippingCop)}`,
    `Total estimado: ${formatCop(totalCop)}`,
  ];

  if (customer.name) lines.push(`Nombre: ${customer.name}`);
  if (customer.phone) lines.push(`Telefono: ${customer.phone}`);
  if (customer.email) lines.push(`Correo: ${customer.email}`);
  if (customer.city) lines.push(`Ciudad: ${customer.city}`);
  if (customer.address) lines.push(`Direccion: ${customer.address}`);
  if (customer.notes) lines.push(`Notas: ${customer.notes}`);

  lines.push("", "Quiero confirmar disponibilidad, forma de pago y siguiente paso.");

  return lines.join("\n");
}

export function buildOrderMessage({
  reference,
  customer,
  items,
  totalCop,
  channel,
}: {
  reference: string;
  customer: CheckoutCustomer;
  items: CartItem[];
  totalCop: number;
  channel: "retail" | "wholesale";
}) {
  const lines = [
    `Hola Empire Essence. Quiero confirmar este pedido ${channel === "wholesale" ? "mayorista" : "retail"}.`,
    `Referencia: ${reference}`,
    "",
    "Productos:",
    ...items.map(
      (item) =>
        `- ${item.productName} ${item.sizeMl}ml x${item.quantity} (${item.channel}) - ${formatCop(
          item.unitPriceCop * item.quantity,
        )}`,
    ),
    "",
    `Total: ${formatCop(totalCop)}`,
    `Nombre: ${customer.name}`,
    `Telefono: ${customer.phone}`,
    `Ciudad: ${customer.city}`,
    `Direccion: ${customer.address}`,
  ];

  if (customer.notes) lines.push(`Notas: ${customer.notes}`);

  return lines.join("\n");
}
