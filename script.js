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

trackMetaEvent("PageView");
trackMetaEvent("ViewContent");

document.querySelectorAll(".buy-button").forEach((button) => {
  button.addEventListener("click", () => {
    trackMetaEvent("AddToCart");
    button.textContent = "Preparando pagamento...";
    button.disabled = true;
    window.setTimeout(() => {
      window.location.href = "/checkout";
    }, 550);
  });
});

const video = document.querySelector("#hero-video");
const playButton = document.querySelector(".play-button");

playButton?.addEventListener("click", async () => {
  if (!video) return;
  playButton.hidden = true;
  video.controls = true;
  await video.play();
});

video?.addEventListener("play", () => {
  if (playButton) playButton.hidden = true;
});

const countdown = document.querySelector("#countdown");
let remaining = 47 * 60;

window.setInterval(() => {
  if (!countdown) return;
  remaining = Math.max(0, remaining - 1);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining / 60) % 60);
  const seconds = remaining % 60;
  countdown.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}, 1000);
