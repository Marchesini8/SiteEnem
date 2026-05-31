import type { PaymentStatus } from "./types";

const payments = new Map<string, PaymentStatus>();

export function savePayment(transactionHash: string, data: Partial<PaymentStatus>) {
  if (!transactionHash) return null;

  const existing = payments.get(transactionHash);
  const next: PaymentStatus = {
    transactionHash,
    status: data.status || existing?.status || "pending",
    amount: data.amount ?? existing?.amount,
    paymentMethod: data.paymentMethod ?? existing?.paymentMethod ?? null,
    paidAt: data.paidAt ?? existing?.paidAt ?? null,
    isPaid: data.isPaid ?? existing?.isPaid ?? false,
    updatedAt: new Date().toISOString(),
  };

  payments.set(transactionHash, next);
  return next;
}

export function getPayment(transactionHash: string) {
  return payments.get(transactionHash) || null;
}
