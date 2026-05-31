const crypto = require("crypto");
const axios = require("axios");

const DEFAULT_PIXEL_ID = "1499267518361019";
const PRODUCT_VALUE = 29.9;
const PRODUCT_ID = "guia-definitivo-enem-2026";
const PRODUCT_NAME = "Guia Definitivo ENEM 2026 - Guia + Simulados + Drive";

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function sha256(value = "") {
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) return String(forwardedFor).split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || undefined;
}

function getEventSourceUrl(req) {
  const origin = req.headers.origin || process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const path = req.body?.event_source_path || req.headers.referer || "/";

  if (String(path).startsWith("http")) return path;
  return `${origin}${path}`;
}

function getBaseCustomData(customData = {}) {
  return {
    currency: "BRL",
    value: PRODUCT_VALUE,
    content_name: PRODUCT_NAME,
    content_ids: [PRODUCT_ID],
    content_type: "product",
    ...customData,
  };
}

function buildUserData({ req, customer = {}, fbp, fbc }) {
  const email = customer.email;
  const phone = onlyDigits(customer.phone || customer.phone_number || "");
  const document = onlyDigits(customer.document || customer.cpf || "");

  return {
    em: sha256(email),
    ph: sha256(phone),
    external_id: sha256(document || email || phone),
    client_ip_address: req ? getClientIp(req) : undefined,
    client_user_agent: req?.headers["user-agent"],
    fbp,
    fbc,
  };
}

function removeEmpty(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entryValue]) => [key, removeEmpty(entryValue)])
      .filter(([, entryValue]) => {
        if (entryValue === undefined || entryValue === null || entryValue === "") return false;
        if (Array.isArray(entryValue) && !entryValue.length) return false;
        if (typeof entryValue === "object" && !Array.isArray(entryValue) && !Object.keys(entryValue).length) return false;
        return true;
      })
  );
}

function isConfigured() {
  return Boolean(process.env.META_ACCESS_TOKEN && (process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID));
}

async function sendEvent({
  eventName,
  eventId,
  req,
  customer,
  fbp,
  fbc,
  customData,
  actionSource = "website",
  eventSourceUrl,
}) {
  if (!isConfigured()) {
    return { skipped: true, reason: "META_ACCESS_TOKEN nao configurado." };
  }

  const pixelId = process.env.META_PIXEL_ID || DEFAULT_PIXEL_ID;
  const graphVersion = process.env.META_GRAPH_VERSION || "v20.0";
  const event = removeEmpty({
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId || crypto.randomUUID(),
    action_source: actionSource,
    event_source_url: eventSourceUrl || (req ? getEventSourceUrl(req) : process.env.PUBLIC_BASE_URL),
    user_data: buildUserData({ req, customer, fbp, fbc }),
    custom_data: getBaseCustomData(customData),
  });

  const response = await axios.post(
    `https://graph.facebook.com/${graphVersion}/${pixelId}/events`,
    {
      data: [event],
      access_token: process.env.META_ACCESS_TOKEN,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 12000,
      proxy: false,
    }
  );

  return response.data;
}

module.exports = {
  PRODUCT_ID,
  PRODUCT_NAME,
  PRODUCT_VALUE,
  isConfigured,
  sendEvent,
};
