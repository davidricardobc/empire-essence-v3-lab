import { NextResponse } from "next/server";
import { verifyWompiEventChecksum } from "@/lib/wompi";

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

  // Persisting payment state needs a database/order store. For now this endpoint validates
  // the event and returns the normalized transaction fields expected by that future store.
  return NextResponse.json({
    ok: true,
    event: payload.event,
    transaction: {
      id: transaction?.id,
      reference: transaction?.reference,
      status: transaction?.status,
      amountInCents: transaction?.amount_in_cents,
    },
  });
}
