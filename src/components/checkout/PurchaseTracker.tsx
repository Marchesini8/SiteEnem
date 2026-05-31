"use client";

import { useEffect } from "react";
import { guideEventPayload, trackMetaEvent } from "@/lib/meta-pixel";

export function PurchaseTracker() {
  useEffect(() => {
    trackMetaEvent("Purchase", guideEventPayload);
  }, []);

  return null;
}
