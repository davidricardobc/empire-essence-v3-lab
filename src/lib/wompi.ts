import crypto from "node:crypto";

const WOMPI_CHECKOUT_URL = process.env.WOMPI_CHECKOUT_URL ?? "https://checkout.wompi.co/p/";

export const wompiConfig = {
  checkoutUrl: WOMPI_CHECKOUT_URL,
  publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY ?? "",
  privateKey: process.env.WOMPI_PRIVATE_KEY ?? "",
  eventsSecret: process.env.WOMPI_EVENTS_SECRET ?? "",
  integritySecret: process.env.WOMPI_INTEGRITY_SECRET ?? "",
  currency: "COP",
};

export function hasWompiPublicConfig() {
  return Boolean(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY && process.env.WOMPI_INTEGRITY_SECRET);
}

export function hasWompiEventsConfig() {
  return Boolean(process.env.WOMPI_EVENTS_SECRET);
}

export function hasWompiPrivateConfig() {
  return Boolean(process.env.WOMPI_PRIVATE_KEY && process.env.WOMPI_EVENTS_SECRET);
}

export function buildWompiCheckoutUrl({
  reference,
  amountCop,
  customerEmail,
}: {
  reference: string;
  amountCop: number;
  customerEmail: string;
}) {
  const publicKey = wompiConfig.publicKey;
  const integritySecret = wompiConfig.integritySecret;
  if (!publicKey || !integritySecret) return null;

  const amountInCents = amountCop * 100;
  const currency = wompiConfig.currency;
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/gracias?ref=${reference}`;
  const signature = crypto
    .createHash("sha256")
    .update(`${reference}${amountInCents}${currency}${integritySecret}`)
    .digest("hex");

  const params = new URLSearchParams({
    "public-key": publicKey,
    currency,
    "amount-in-cents": String(amountInCents),
    reference,
    "customer-data:email": customerEmail,
    "redirect-url": redirectUrl,
    "payment-method-type": "CARD",
    "signature:integrity": signature,
  });

  return `${wompiConfig.checkoutUrl}?${params.toString()}`;
}

type WompiSignature = {
  checksum?: string;
  properties?: string[];
};

type WompiEventPayload = {
  data?: Record<string, unknown>;
  timestamp?: number | string;
  signature?: WompiSignature;
};

function readPath(source: Record<string, unknown>, path: string) {
  const normalizedPath = path.startsWith("data.") ? path.slice(5) : path;
  return normalizedPath.split(".").reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[segment];
  }, source);
}

export function buildWompiEventChecksum(payload: WompiEventPayload, eventsSecret: string) {
  const properties = payload.signature?.properties ?? [];
  const values = properties.map((property) => {
    const value = payload.data ? readPath(payload.data, property) : undefined;
    return value === undefined || value === null ? "" : String(value);
  });

  return crypto
    .createHash("sha256")
    .update(`${values.join("")}${payload.timestamp ?? ""}${eventsSecret}`)
    .digest("hex");
}

export function verifyWompiEventChecksum(payload: WompiEventPayload, eventsSecret: string) {
  const expectedChecksum = payload.signature?.checksum;
  const properties = payload.signature?.properties;
  if (!expectedChecksum || !properties?.length || !payload.timestamp) return false;

  const computed = buildWompiEventChecksum(payload, eventsSecret);
  const expectedBuffer = Buffer.from(expectedChecksum, "hex");
  const computedBuffer = Buffer.from(computed, "hex");

  return expectedBuffer.length === computedBuffer.length && crypto.timingSafeEqual(expectedBuffer, computedBuffer);
}

export function mapWompiTransactionStatus(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return { paymentStatus: "paid" as const, orderStatus: "confirmed" as const };
    case "DECLINED":
    case "ERROR":
    case "VOIDED":
      return { paymentStatus: "failed" as const, orderStatus: "pending" as const };
    default:
      return { paymentStatus: "pending" as const, orderStatus: "pending" as const };
  }
}
