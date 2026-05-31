const checkoutForm = document.querySelector("#checkout-page-form");
const checkoutFeedback = document.querySelector("#checkout-feedback");
const generatePixButton = document.querySelector(".generate-pix");
const pixResultPage = document.querySelector("#pix-result-page");
const checkoutPixQr = document.querySelector("#checkout-pix-qr");
const checkoutPixEmpty = document.querySelector("#checkout-pix-empty");
const checkoutPixCode = document.querySelector("#checkout-pix-code");
const copyPixPageButton = document.querySelector(".copy-pix-page");

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
          document: payload.document,
          phone: payload.phone,
        },
        delivery: {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível gerar o Pix.");
    }

    showPixResult(data);
    setFeedback("Pix gerado. Pague usando o QR Code ou o código copia e cola.", "success");
  } catch (error) {
    setFeedback(error.message, "error");
    generatePixButton.classList.remove("is-hidden");
  } finally {
    generatePixButton.disabled = false;
    generatePixButton.textContent = "Gerar Pix - R$ 29,90";
  }
});

copyPixPageButton?.addEventListener("click", async () => {
  const code = checkoutPixCode?.value || "";
  if (!code) return;

  await navigator.clipboard.writeText(code);
  copyPixPageButton.textContent = "Código copiado";
  window.setTimeout(() => {
    copyPixPageButton.textContent = "Copiar código Pix";
  }, 1500);
});
