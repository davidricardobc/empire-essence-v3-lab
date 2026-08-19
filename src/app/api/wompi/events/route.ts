import { NextResponse } from "next/server";
import { getOrder, updateOrderPayment } from "@/lib/order-store";
import { notifyOrder } from "@/lib/order-notifications";
import { mapWompiTransactionStatus, verifyWompiEventChecksum } from "@/lib/wompi";

type WompiTransaction = {
  id?: string;
  reference?: string;
  status?: string;
  amount_in_cents?: number;
};

type WompiEventPayload = {
  event?: string;
  data?: {
    transaction?: WompiTransaction;
  };
  timestamp?: number | string;
  signature?: {
    checksum?: string;
    properties?: string[];
  };
};

export async function POST(request: Request) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) {
    return NextResponse.json(
      {
        ok: false,
        message: "Wompi events secret is not configured.",
      },
      { status: 503 },
    );
  }

  let payload: WompiEventPayload;
  try {
    payload = (await request.json()) as WompiEventPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON payload." }, { status: 400 });
  }

  if (!verifyWompiEventChecksum(payload, eventsSecret)) {
    return NextResponse.json({ ok: false, message: "Invalid Wompi event signature." }, { status: 401 });
  }

  const transaction = payload.data?.transaction;
  const reference = transaction?.reference;
  const mapped = mapWompiTransactionStatus(transaction?.status ?? "PENDING");

  if (!reference) {
    return NextResponse.json({ ok: false, message: "Missing transaction reference." }, { status: 400 });
  }

  const currentOrder = await getOrder(reference);
  if (!currentOrder) {
    return NextResponse.json({ ok: false, message: "Order reference was not found." }, { status: 404 });
  }

  if (transaction?.amount_in_cents !== currentOrder.totalCop * 100) {
    return NextResponse.json({ ok: false, message: "Transaction amount does not match order total." }, { status: 409 });
  }

  const order = await updateOrderPayment(reference, {
    ...mapped,
    wompiTransactionId: transaction?.id ?? null,
    wompiStatus: transaction?.status ?? "PENDING",
  });

  if (order && currentOrder.paymentStatus !== order.paymentStatus) {
    await notifyOrder("order.payment_updated", order);
  }

  return NextResponse.json({
    ok: true,
    event: payload.event,
    reference,
    orderFound: Boolean(order),
    transaction: {
      id: transaction?.id,
      reference,
      status: transaction?.status,
      amountInCents: transaction?.amount_in_cents,
    },
    paymentStatus: mapped.paymentStatus,
    orderStatus: mapped.orderStatus,
  });
}
