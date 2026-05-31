const checkoutForm = document.querySelector("#checkout-page-form");
const checkoutFeedback = document.querySelector("#checkout-feedback");
const generatePixButton = document.querySelector(".generate-pix");
const pixResultPage = document.querySelector("#pix-result-page");
const checkoutPixQr = document.querySelector("#checkout-pix-qr");
const checkoutPixEmpty = document.querySelector("#checkout-pix-empty");
const checkoutPixCode = document.querySelector("#checkout-pix-code");
const copyPixPageButton = document.querySelector(".copy-pix-page");
const documentInput = checkoutForm?.querySelector('input[name="document"]');
const phoneInput = checkoutForm?.querySelector('input[name="phone"]');

const productPayload = {
  value: 29.9,
  currency: "BRL",
  content_name: "Guia Definitivo ENEM 2026 - Guia + Simulados + Drive",
  content_ids: ["guia-definitivo-enem-2026"],
  content_type: "product",
};

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
  window.setTimeout(() => pixResultPage.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
}

checkoutForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(checkoutForm);
  const payload = Object.fromEntries(formData.entries());
  const documentDigits = onlyDigits(payload.document);
  const phoneDigits = onlyDigits(payload.phone);

  if (!isValidCpf(documentDigits) || !isValidPhone(phoneDigits)) {
    setFeedback("Preencha CPF e WhatsApp corretamente para gerar o Pix.", "error");
    updateGeneratePixState();
    return;
  }

  if (typeof fbq === "function") fbq("track", "InitiateCheckout", productPayload);

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

copyPixPageButton?.addEventListener("click", async () => {
  const code = checkoutPixCode?.value || "";
  if (!code) return;

  await navigator.clipboard.writeText(code);
  copyPixPageButton.textContent = "Codigo copiado";
  window.setTimeout(() => {
    copyPixPageButton.textContent = "Copiar codigo Pix";
  }, 1500);
});
