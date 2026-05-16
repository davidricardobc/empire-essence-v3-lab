export function formatCop(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function plainCop(value: number) {
  return `$${new Intl.NumberFormat("es-CO").format(value)}`;
}
