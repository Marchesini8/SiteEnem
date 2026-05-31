const axios = require("axios");
const paymentStatusStore = require("./paymentStatusStore");

const FIXED_SHIPPING_AMOUNT = 0;
const DEFAULT_ITEM_TITLE = "Guia Definitivo ENEM 2026";

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function isValidCpf(value = "") {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) sum += Number(cpf[index]) * (10 - index);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) sum += Number(cpf[index]) * (11 - index);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;

  return digit === Number(cpf[10]);
}

function isValidPhone(value = "") {
  const phone = onlyDigits(value);
  return phone.length === 10 || phone.length === 11;
}

function normalizeItemPrice(item) {
  const unitPrice = Number(item?.unitPrice || 0);
  if (unitPrice > 0) return unitPrice;

  const directPrice = Number(item?.price || 0);
  if (directPrice > 0) return directPrice;

  return Number(item?.oldPrice || 0);
}

function requireEnv(name) {
  if (process.env[name]) return process.env[name];

  const error = new Error(`${name} não configurado no .env.`);
  error.statusCode = 500;
  throw error;
}

function extractPixCode(data) {
  return (
    data.pix_code ||
    data.pixCode ||
    data.pix?.pix_qr_code ||
    data.pix_qr_code ||
    null
  );
}

function extractTransactionHash(data) {
  return (
    data.transaction_hash ||
    data.transactionHash ||
    data.pix?.transaction_hash ||
    data.pix?.transactionHash ||
    null
  );
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== "" && entryValue !== null && entryValue !== undefined)
  );
}

function getProviderMessage(error) {
  const providerError = error.response?.data || error.message;

  if (typeof providerError === "string") return providerError;
  if (providerError?.message) return providerError.message;
  if (providerError?.error) return providerError.error;
  return JSON.stringify(providerError);
}

exports.createPixPayment = async ({ items, customer, delivery }) => {
  const normalizedItems = Array.isArray(items) ? items : [];
  const productTotal = normalizedItems.reduce((sum, item) => {
    return sum + normalizeItemPrice(item) * Number(item?.qty || item?.quantity || 1);
  }, 0);
  const totalAmount = productTotal + FIXED_SHIPPING_AMOUNT;
  const totalInCents = Math.round(totalAmount * 100);

  if (!normalizedItems.length || totalInCents <= 0) {
    const error = new Error("Valor inválido para gerar pagamento Pix.");
    error.statusCode = 400;
    throw error;
  }

  const customerDocument = onlyDigits(customer.document || customer.cpf || process.env.DEFAULT_DOCUMENT || "");
  const customerPhone = onlyDigits(customer.phone_number || customer.phone || process.env.DEFAULT_PHONE_NUMBER || "");

  if (!customer.name || !customer.email || !isValidCpf(customerDocument) || !isValidPhone(customerPhone)) {
    const error = new Error("Preencha nome, e-mail, CPF e WhatsApp validos para gerar o Pix.");
    error.statusCode = 400;
    throw error;
  }

  const paymentApiUrl = requireEnv("PAYMENT_API_URL");
  const paymentApiKey = requireEnv("PAYMENT_API_KEY");
  const offerHash = requireEnv("IRONPAY_OFFER_HASH");
  const productHash = requireEnv("IRONPAY_PRODUCT_HASH");
  const pixEndpoint = process.env.PAYMENT_PIX_ENDPOINT || "/transactions";
  const expireInDays = Number(process.env.IRONPAY_EXPIRE_IN_DAYS || 1);

  const cart = normalizedItems.map((item) => compactObject({
    offer_hash: offerHash,
    product_hash: productHash,
    title: item.title || DEFAULT_ITEM_TITLE,
    cover: item.image || undefined,
    price: Math.round(normalizeItemPrice(item) * 100),
    quantity: Number(item?.qty || item?.quantity || 1),
    operation_type: 1,
    tangible: false,
  }));

  const postbackUrl = process.env.IRONPAY_POSTBACK_URL || "";

  try {
    const response = await axios.post(
      `${paymentApiUrl}${pixEndpoint}`,
      compactObject({
        api_token: paymentApiKey,
        offer_hash: offerHash,
        amount: totalInCents,
        payment_method: "pix",
        installments: 1,
        expire_in_days: expireInDays,
        transaction_origin: "api",
        postback_url: postbackUrl,
        cart,
        customer: compactObject({
          name: customer.name,
          email: customer.email,
          phone_number: customerPhone,
          document: customerDocument,
          street_name: customer.street_name || delivery?.address || "",
          number: customer.number || delivery?.number || "",
          complement: customer.complement || delivery?.complement || "",
          neighborhood: customer.neighborhood || delivery?.neighborhood || process.env.DEFAULT_NEIGHBORHOOD || "",
          city: customer.city || delivery?.city || "",
          state: customer.state || delivery?.state || process.env.DEFAULT_STATE || "",
          zip_code: customer.zip_code || delivery?.zip_code || delivery?.cep || "",
        }),
        tracking: {
          src: "",
          utm_source: "",
          utm_medium: "",
          utm_campaign: "",
          utm_term: "",
          utm_content: "",
        },
      }),
      {
        params: {
          api_token: paymentApiKey,
        },
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        proxy: false,
      }
    );

    const pixCode = extractPixCode(response.data);
    const transactionHash = extractTransactionHash(response.data);

    if (!pixCode) {
      const error = new Error(`IronPay respondeu sem código Pix válido: ${JSON.stringify(response.data)}`);
      error.statusCode = 502;
      throw error;
    }

    if (transactionHash) {
      paymentStatusStore.savePayment(transactionHash, {
        status: response.data.status || "pending",
        amount: response.data.amount || totalInCents,
        paymentMethod: "pix",
        isPaid: response.data.status === "paid",
        pixCode,
      });
    }

    return {
      transaction_hash: transactionHash,
      status: response.data.status || "pending",
      pix_code: pixCode,
      pix_base64:
        response.data.qr_code ||
        response.data.pix_base64 ||
        response.data.qrCode ||
        response.data.pix?.qr_code_base64 ||
        null,
      charged_total: totalAmount,
      product_total: productTotal,
      shipping_total: FIXED_SHIPPING_AMOUNT,
      source: "ironpay",
    };
  } catch (error) {
    const providerMessage = getProviderMessage(error);
    const paymentError = new Error(`Falha ao gerar Pix na IronPay: ${providerMessage}`);
    paymentError.statusCode = error.response?.status || error.statusCode || 502;
    paymentError.providerMessage = providerMessage;
    throw paymentError;
  }
};

exports.getPaymentStatus = (transactionHash) => paymentStatusStore.getPayment(transactionHash);
