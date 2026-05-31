import type { Metadata } from "next";
import { PurchaseTracker } from "@/components/checkout/PurchaseTracker";
import { Footer } from "@/components/layout/Footer";
import { VerifiedIcon } from "@/components/ui/VerifiedIcon";
import { product } from "@/lib/guide-data";

export const metadata: Metadata = {
  title: "Compra confirmada",
  description: "Confirmação de compra do Guia Definitivo ENEM 2026.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <PurchaseTracker />
      <main className="grid min-h-[70vh] place-items-center bg-blue-50 px-5 py-16">
        <section className="w-full max-w-2xl rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-glow">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-50">
            <VerifiedIcon size={46} />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-wide text-brand-blue">Compra confirmada</p>
          <h1 className="mt-3 text-4xl font-black text-brand-navy">Seu guia está quase chegando</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Obrigado por garantir o {product.name}. Configure sua integração de pagamento para liberar o Drive completo automaticamente após a confirmação.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
