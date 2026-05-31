const checkoutForm = document.querySelector("#checkout-page-form");
const checkoutFeedback = document.querySelector("#checkout-feedback");
const generatePixButton = document.querySelector(".generate-pix");
const pixResultPage = document.querySelector("#pix-result-page");
const checkoutPixQr = document.querySelector("#checkout-pix-qr");
const checkoutPixEmpty = document.querySelector("#checkout-pix-empty");
const checkoutPixCode = document.querySelector("#checkout-pix-code");
const copyPixPageButton = document.querySelector(".copy-pix-page");
const pixCopyToast = document.querySelector("#pix-copy-toast");
const customerInputs = Array.from(checkoutForm?.querySelectorAll("input") || []);
const editFieldButtons = Array.from(checkoutForm?.querySelectorAll(".edit-field") || []);
const documentInput = checkoutForm?.querySelector('input[name="document"]');
const phoneInput = checkoutForm?.querySelector('input[name="phone"]');
let pixCopyToastTimer;

const productPayload = {
  value: 29.9,
  currency: "BRL",
  content_name: "Guia Definitivo ENEM 2026 - Guia + Simulados + Drive",
  content_ids: ["guia-definitivo-enem-2026"],
  content_type: "product",
};

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")[1];
}

function createEventId(eventName) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return `${eventName}-${crypto.randomUUID()}`;
  return `${eventName}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function trackMetaEvent(eventName, payload = productPayload) {
  const eventId = createEventId(eventName);

  if (typeof fbq === "function") fbq("track", eventName, payload, { eventID: eventId });

  fetch("/api/events/meta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    keepalive: true,
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_path: window.location.pathname,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
      custom_data: payload,
    }),
  }).catch(() => {});
}

function setFeedback(message = "", type = "info") {
  if (!checkoutFeedback) return;
  checkoutFeedback.textContent = message;
  checkoutFeedback.dataset.type = type;
}

function getCheckoutErrorMessage(error) {
  const message = error?.message || "";

  if (!message) return "Nao foi possivel gerar o Pix. Tente novamente em alguns instantes.";
  if (message.includes("{") || message.includes("success") || message.includes("IronPay")) {
    return "Nao foi possivel gerar o Pix agora. Confira os dados e tente novamente.";
  }

  return message;
}

function onlyDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

function maskCpf(value = "") {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value = "") {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits.replace(/(\d{0,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
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

function updateGeneratePixState() {
  if (!checkoutForm || !generatePixButton) return;

  const documentIsValid = isValidCpf(documentInput?.value);
  const phoneIsValid = isValidPhone(phoneInput?.value);
  const formIsValid = checkoutForm.checkValidity() && documentIsValid && phoneIsValid;

  documentInput?.classList.toggle("is-invalid", Boolean(documentInput.value) && !documentIsValid);
  phoneInput?.classList.toggle("is-invalid", Boolean(phoneInput.value) && !phoneIsValid);
  generatePixButton.disabled = !formIsValid;
}

function setCheckoutFieldsLocked(isLocked) {
  customerInputs.forEach((input) => {
    input.readOnly = isLocked;
    input.classList.remove("is-editing");
  });

  editFieldButtons.forEach((button) => {
    button.hidden = !isLocked;
  });
}

function unlockCheckoutField(input) {
  if (!input || !generatePixButton || !pixResultPage) return;

  input.readOnly = false;
  input.classList.add("is-editing");
  pixResultPage.hidden = true;
  generatePixButton.classList.remove("is-hidden");
  setFeedback("Corrija o dado e gere um novo Pix.", "info");
  updateGeneratePixState();

  window.setTimeout(() => {
    input.focus();
    input.select();
  }, 50);
}

function normalizeQrImageSource(qrImage = "", pixPayload = "") {
  const value = String(qrImage || "").trim();

  if (value.startsWith("data:image/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value) return `data:image/png;base64,${value.replace(/\s/g, "")}`;

  if (!pixPayload) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(pixPayload)}`;
}

function showPixResult(data = {}) {
  checkoutPixCode.value = data.pix_code || "";
  const qrImageSource = normalizeQrImageSource(data.pix_base64, data.pix_code);

  if (qrImageSource) {
    checkoutPixQr.src = qrImageSource;
    checkoutPixQr.classList.add("is-visible");
    checkoutPixEmpty.classList.add("is-hidden");
  } else {
    checkoutPixQr.classList.remove("is-visible");
    checkoutPixEmpty.classList.remove("is-hidden");
  }

  pixResultPage.hidden = false;
  generatePixButton.classList.add("is-hidden");
  setCheckoutFieldsLocked(true);
  window.setTimeout(() => pixResultPage.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
}

function showPixCopyToast() {
  if (!pixCopyToast) return;

  window.clearTimeout(pixCopyToastTimer);
  pixCopyToast.hidden = false;
  pixCopyToastTimer = window.setTimeout(() => {
    pixCopyToast.hidden = true;
  }, 1600);
}

async function copyPixCode() {
  const code = checkoutPixCode?.value || "";
  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
  } catch (error) {
    checkoutPixCode.focus();
    checkoutPixCode.select();
    document.execCommand("copy");
    checkoutPixCode.setSelectionRange(0, 0);
  }

  showPixCopyToast();
  copyPixPageButton.textContent = "Codigo copiado";
  window.setTimeout(() => {
    copyPixPageButton.textContent = "Copiar codigo Pix";
  }, 1500);
}

function getTrackingData() {
  const params = new URLSearchParams(window.location.search);
  return {
    src: params.get("src") || "",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
  };
}

trackMetaEvent("PageView");

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setCheckoutFieldsLocked(false);

  const formData = new FormData(checkoutForm);
  const payload = Object.fromEntries(formData.entries());
  const documentDigits = onlyDigits(payload.document);
  const phoneDigits = onlyDigits(payload.phone);

  if (!isValidCpf(documentDigits) || !isValidPhone(phoneDigits)) {
    setFeedback("Preencha CPF e WhatsApp corretamente para gerar o Pix.", "error");
    updateGeneratePixState();
    return;
  }

  trackMetaEvent("InitiateCheckout");

  generatePixButton.disabled = true;
  generatePixButton.textContent = "Gerando Pix...";
  setFeedback("");

  try {
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: "Guia Definitivo ENEM 2026",
            price: 29.9,
            quantity: 1,
          },
        ],
        customer: {
          name: payload.name,
          email: payload.email,
          document: documentDigits,
          phone: phoneDigits,
        },
        delivery: {},
        tracking: getTrackingData(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Nao foi possivel gerar o Pix.");
    }

    showPixResult(data);
    setFeedback("Pix gerado. Pague usando o QR Code ou o codigo copia e cola.", "success");
  } catch (error) {
    setFeedback(getCheckoutErrorMessage(error), "error");
    generatePixButton.classList.remove("is-hidden");
    setCheckoutFieldsLocked(false);
  } finally {
    generatePixButton.textContent = "Gerar Pix - R$ 29,90";
    updateGeneratePixState();
  }
});

documentInput?.addEventListener("input", () => {
  documentInput.value = maskCpf(documentInput.value);
  updateGeneratePixState();
});

phoneInput?.addEventListener("input", () => {
  phoneInput.value = maskPhone(phoneInput.value);
  updateGeneratePixState();
});

checkoutForm?.addEventListener("input", updateGeneratePixState);
updateGeneratePixState();

editFieldButtons.forEach((button) => {
  const input = button.closest(".field-control")?.querySelector("input");
  button.addEventListener("click", () => unlockCheckoutField(input));
});

copyPixPageButton?.addEventListener("click", copyPixCode);
checkoutPixCode?.addEventListener("click", copyPixCode);
