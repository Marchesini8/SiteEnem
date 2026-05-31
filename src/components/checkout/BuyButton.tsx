"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { guideEventPayload, trackMetaEvent } from "@/lib/meta-pixel";

type BuyButtonProps = {
  label: string;
  compact?: boolean;
  className?: string;
};

export function BuyButton({ label, compact, className }: BuyButtonProps) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  function handleClick() {
    if (isLeaving) return;

    setIsLeaving(true);
    trackMetaEvent("AddToCart", guideEventPayload);

    window.setTimeout(() => {
      router.push("/checkout");
    }, 650);
  }

  return (
    <PrimaryButton compact={compact} className={`${className || ""} ${isLeaving ? "scale-[0.98] brightness-105" : ""}`} onClick={handleClick} disabled={isLeaving}>
      {isLeaving ? "Preparando checkout..." : label}
    </PrimaryButton>
  );
}
