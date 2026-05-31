export const META_PIXEL_ID = "1499267518361019";

type MetaEventPayload = {
  value?: number;
  currency?: string;
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
};

declare global {
  interface Window {
    fbq?: (
      action: "track" | "init" | "consent",
      eventName: string,
      payload?: MetaEventPayload,
    ) => void;
  }
}

export function trackMetaEvent(eventName: string, payload?: MetaEventPayload) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, payload);
}

export const guideEventPayload = {
  value: 29.9,
  currency: "BRL",
  content_name: "Guia Definitivo ENEM 2026 - Guia + Simulados + Drive",
  content_ids: ["guia-definitivo-enem-2026"],
  content_type: "product",
  num_items: 1,
};
