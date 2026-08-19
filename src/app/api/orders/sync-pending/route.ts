import { NextResponse } from "next/server";
import { listPendingWompiOrders, updateOrderPayment } from "@/lib/order-store";
import { notifyOrder } from "@/lib/order-notifications";
import { getLatestWompiTransaction, mapWompiTransactionStatus } from "@/lib/wompi";

function getSyncSecret() {
  return process.env.ORDER_SYNC_SECRET?.trim() || process.env.CRON_SECRET?.trim();
}

function isAuthorized(request: Request) {
  const secret = getSyncSecret();
  if (!secret) return false;

  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!getSyncSecret()) {
    return NextResponse.json({ ok: false, message: "Order sync secret is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const pendingOrders = await listPendingWompiOrders(25);
  const results = [];

  for (const order of pendingOrders) {
    const transaction = await getLatestWompiTransaction(order.reference);

    if (!transaction) {
      results.push({ reference: order.reference, updated: false, reason: "transaction_not_found" });
      continue;
    }

    if (transaction.amount_in_cents !== order.totalCop * 100) {
      results.push({ reference: order.reference, updated: false, reason: "amount_mismatch" });
      continue;
    }

    const mapped = mapWompiTransactionStatus(transaction.status ?? "PENDING");

    if (mapped.paymentStatus === order.paymentStatus && mapped.orderStatus === order.orderStatus) {
      results.push({ reference: order.reference, updated: false, reason: "unchanged" });
      continue;
    }

    const updatedOrder = await updateOrderPayment(order.reference, {
      ...mapped,
      wompiTransactionId: transaction.id ?? null,
      wompiStatus: transaction.status ?? "PENDING",
    });

    if (updatedOrder) {
      await notifyOrder("order.payment_updated", updatedOrder);
    }

    results.push({
      reference: order.reference,
      updated: Boolean(updatedOrder),
      paymentStatus: mapped.paymentStatus,
      orderStatus: mapped.orderStatus,
      wompiStatus: transaction.status,
    });
  }

  return NextResponse.json({
    ok: true,
    checked: pendingOrders.length,
    results,
  });
}
