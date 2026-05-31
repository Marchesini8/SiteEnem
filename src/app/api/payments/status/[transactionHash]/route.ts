import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payments/status-store";

type RouteContext = {
  params: Promise<{
    transactionHash: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { transactionHash } = await context.params;
  const payment = getPayment(transactionHash);

  if (!payment) {
    return NextResponse.json({
      transactionHash,
      status: "pending",
      isPaid: false,
    });
  }

  return NextResponse.json(payment);
}
