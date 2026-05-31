import { product } from "@/lib/guide-data";
import { savePayment } from "./status-store";
import type { CheckoutPayload, CheckoutResult } from "./types";

const FIXED_SHIPPING_AMOUNT = 0;

export function buildGuideCheckoutPayload(customer: CheckoutPayload["customer"]): CheckoutPayload {
  return {
    items: [
      {
        title: product.name,
        price: product.price,
        quantity: 1,
      },
    ],
    customer,
    delivery: {},
  };
}

function requireEnv(name: string) {
  const value = process.env[name];

  if (value) return value;

  throw new Error(`${name} não configurado no .env.`);
}

function normalizeItemPrice(item: CheckoutPayload["items"][number]) {
  const price = Number(item.price || 0);
  return price > 0 ? price : 0;
}

function extractPixCode(data: Record<string, unknown>) {
  const pix = data.pix && typeof data.pix === "object" ? (data.pix as Record<string, unknown>) : {};

  return (
    data.pix_code ||
    data.pixCode ||
    pix.pix_qr_code ||
    data.pix_qr_code ||
    null
  ) as string | null;
}

function extractTransactionHash(data: Record<string, unknown>) {
  const pix = data.pix && typeof data.pix === "object" ? (data.pix as Record<string, unknown>) : {};

  return (
    data.transaction_hash ||
    data.transactionHash ||
    pix.transaction_hash ||
    pix.transactionHash ||
    null
  ) as string | null;
}

function extractQrImage(data: Record<string, unknown>) {
  const pix = data.pix && typeof data.pix === "object" ? (data.pix as Record<string, unknown>) : {};

  return (
    data.qr_code ||
    data.pix_base64 ||
    data.qrCode ||
    pix.qr_code_base64 ||
    null
  ) as string | null;
}

export async function createCheckoutWithRealProvider(
  payload: CheckoutPayload,
): Promise<CheckoutResult> {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const productTotal = items.reduce((sum, item) => {
    return sum + normalizeItemPrice(item) * Number(item.quantity || 1);
  }, 0);
  const totalAmount = productTotal + FIXED_SHIPPING_AMOUNT;
  const totalInCents = Math.round(totalAmount * 100);

  if (!items.length || totalInCents <= 0) {
    throw new Error("Valor inválido para gerar pagamento Pix.");
  }

  const paymentApiUrl = requireEnv("PAYMENT_API_URL");
  const paymentApiKey = requireEnv("PAYMENT_API_KEY");
  const offerHash = requireEnv("IRONPAY_OFFER_HASH");
  const productHash = requireEnv("IRONPAY_PRODUCT_HASH");
  const pixEndpoint = process.env.PAYMENT_PIX_ENDPOINT || "/transactions";
  const expireInDays = Number(process.env.IRONPAY_EXPIRE_IN_DAYS || 1);
  const endpoint = new URL(`${paymentApiUrl}${pixEndpoint}`);
  endpoint.searchParams.set("api_token", paymentApiKey);

  const cart = items.map((item) => ({
    product_hash: productHash,
    title: item.title || product.name,
    cover: null,
    price: Math.round(normalizeItemPrice(item) * 100),
    quantity: Number(item.quantity || 1),
    operation_type: 1,
    tangible: false,
  }));

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      offer_hash: offerHash,
      amount: totalInCents,
      payment_method: "pix",
      expire_in_days: expireInDays,
      transaction_origin: "api",
      postback_url: process.env.IRONPAY_POSTBACK_URL || "",
      cart,
      customer: {
        name: payload.customer.name,
        email: payload.customer.email,
        phone_number: payload.customer.phone || process.env.DEFAULT_PHONE_NUMBER || "",
        document: payload.customer.document || process.env.DEFAULT_DOCUMENT || "",
        street_name: "",
        number: "",
        complement: "",
        neighborhood: process.env.DEFAULT_NEIGHBORHOOD || "",
        city: "",
        state: process.env.DEFAULT_STATE || "",
        zip_code: "",
      },
      tracking: {
        src: "",
        utm_source: "",
        utm_medium: "",
        utm_campaign: "",
        utm_term: "",
        utm_content: "",
      },
    }),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw new Error(
      `Falha ao gerar Pix na IronPay: ${
        typeof data.message === "string" ? data.message : JSON.stringify(data)
      }`,
    );
  }

  const pixCode = extractPixCode(data);
  const transactionHash = extractTransactionHash(data);

  if (!pixCode) {
    throw new Error(`IronPay respondeu sem código Pix válido: ${JSON.stringify(data)}`);
  }

  if (transactionHash) {
    savePayment(transactionHash, {
      status: typeof data.status === "string" ? data.status : "pending",
      amount: typeof data.amount === "number" ? data.amount : totalInCents,
      paymentMethod: "pix",
      isPaid: data.status === "paid",
    });
  }

  return {
    transaction_hash: transactionHash,
    status: typeof data.status === "string" ? data.status : "pending",
    pix_code: pixCode,
    pix_base64: extractQrImage(data),
    charged_total: totalAmount,
  };
}
