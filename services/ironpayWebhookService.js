const paymentStatusStore = require("./paymentStatusStore");
const metaConversionsService = require("./metaConversionsService");

function validateWebhookKey(receivedKey) {
  const expectedKey = process.env.IRONPAY_WEBHOOK_SECRET || process.env.PAYMENT_API_KEY;

  if (!expectedKey) {
    const error = new Error("IRONPAY_WEBHOOK_SECRET não configurado no .env.");
    error.statusCode = 500;
    throw error;
  }

  if (!receivedKey || receivedKey !== expectedKey) {
    const error = new Error("Chave do webhook inválida.");
    error.statusCode = 401;
    throw error;
  }
}

async function processWebhook(payload) {
  const { transaction_hash, status, amount, payment_method, paid_at } = payload || {};

  if (!transaction_hash || !status || typeof amount !== "number") {
    const error = new Error("Payload do webhook inválido.");
    error.statusCode = 400;
    throw error;
  }

  const normalized = {
    transactionHash: transaction_hash,
    status,
    amount,
    paymentMethod: payment_method || null,
    paidAt: paid_at || null,
    isPaid: status === "paid",
  };

  const payment = paymentStatusStore.savePayment(normalized.transactionHash, normalized);

  if (normalized.isPaid) {
    metaConversionsService
      .sendEvent({
        eventName: "Purchase",
        eventId: `purchase-${normalized.transactionHash}`,
        customer: payment?.customer,
        actionSource: "website",
        customData: {
          value: amount / 100,
          order_id: normalized.transactionHash,
        },
      })
      .catch((error) => {
        console.error("Erro ao enviar Purchase para Meta:", error.response?.data || error.message);
      });
  }

  return normalized;
}

module.exports = {
  validateWebhookKey,
  processWebhook,
};
