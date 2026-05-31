"use client";

import { useEffect } from "react";
import { guideEventPayload, trackMetaEvent } from "@/lib/meta-pixel";

export function ViewContentTracker() {
  useEffect(() => {
    trackMetaEvent("ViewContent", guideEventPayload);
  }, []);

  return null;
}
