"use client";

import { product } from "@/lib/guide-data";
import { BuyButton } from "./BuyButton";

export function MobileBuyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-blue-100 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase text-slate-500">Oferta promocional</p>
          <p className="text-lg font-black text-brand-blue">{product.priceLabel}</p>
        </div>
        <BuyButton label="Garantir agora" compact className="shrink-0 px-4" />
      </div>
    </div>
  );
}
