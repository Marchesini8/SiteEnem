import { BadgeCheck, Clock3, Download, ShieldCheck } from "lucide-react";
import { BuyButton } from "@/components/checkout/BuyButton";
import { product } from "@/lib/guide-data";

const trustItems = [
  { label: "Drive imediato", icon: Download },
  { label: "Garantia de 7 dias", icon: ShieldCheck },
  { label: "Pagamento seguro", icon: BadgeCheck },
];

export function OfferSection() {
  return (
    <section id="oferta" className="bg-brand-navy py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-brand-yellow">Oferta especial</p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
            Comece sua organização para o ENEM hoje por menos que uma pizza.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Acesso ao guia completo, simulados, cronograma, checklist e estratégias em um Drive organizado para estudar de forma prática.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustItems.map(({ label, icon: Icon }) => {
              return (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-white/10 p-3 text-sm font-bold">
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white p-6 text-brand-navy shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-brand-blue">
            <Clock3 size={17} aria-hidden="true" />
            Condição promocional
          </div>
          <p className="mt-5 text-sm font-bold text-slate-500">De <span className="line-through">{product.oldPriceLabel}</span> por apenas</p>
          <div className="mt-2 text-5xl font-black text-brand-blue">{product.priceLabel}</div>
          <p className="mt-3 text-sm font-semibold text-slate-600">
            Pagamento único. Produto digital entregue após a confirmação da compra.
          </p>
          <BuyButton label={`${product.checkoutLabel} por ${product.priceLabel}`} className="mt-6 w-full" />
          <p className="mt-4 text-center text-xs font-semibold text-slate-500">
            Arquitetura pronta para conectar sua integração de pagamento real.
          </p>
        </div>
      </div>
    </section>
  );
}
