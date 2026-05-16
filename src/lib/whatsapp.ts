import type { CartItem } from "@/types/cart";
import type { CheckoutCustomer } from "@/types/checkout";
import { formatCop } from "@/lib/currency";

export function getWhatsappNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573156753404";
}

export function buildWhatsappUrl(message: string) {
  return `https://wa.me/${getWhatsappNumber()}?text=${encodeURIComponent(message)}`;
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
