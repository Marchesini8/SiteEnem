import { savePayment } from "./status-store";

export function validateWebhookSecret(receivedKey: string | null) {
  const expectedKey = process.env.IRONPAY_WEBHOOK_SECRET || process.env.PAYMENT_API_KEY;

  if (!expectedKey) {
    throw new Error("IRONPAY_WEBHOOK_SECRET nao configurado no ambiente.");
  }

  if (!receivedKey || receivedKey !== expectedKey) {
    const error = new Error("Chave do webhook invalida.");
    error.name = "UnauthorizedWebhook";
    throw error;
  }
}

export function processPaymentWebhook(payload: Record<string, unknown>) {
  /*
   * COLE AQUI AS ADAPTACOES DO SEU WEBHOOK REAL.
   *
   * A estrutura abaixo está alinhada ao projeto antigo:
   * transaction_hash, status, amount, payment_method e paid_at.
   */
  const transactionHash = String(payload.transaction_hash || "");
  const status = String(payload.status || "");
  const amount = Number(payload.amount);

  if (!transactionHash || !status || Number.isNaN(amount)) {
    throw new Error("Payload do webhook invalido.");
  }

  return savePayment(transactionHash, {
    status,
    amount,
    paymentMethod: typeof payload.payment_method === "string" ? payload.payment_method : null,
    paidAt: typeof payload.paid_at === "string" ? payload.paid_at : null,
    isPaid: status === "paid",
  });
}
