import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de uso do Guia Definitivo ENEM 2026.",
};

export default function TermsPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-brand-blue">Legal</p>
        <h1 className="mt-3 text-4xl font-black text-brand-navy">Termos de Uso</h1>
        <div className="mt-8 space-y-5 leading-8 text-slate-700">
          <p>O Guia Definitivo ENEM 2026 é um produto digital educacional. O acesso ao material deve ser liberado após a confirmação do pagamento.</p>
          <p>A garantia promocional é de 7 dias, respeitando as condições informadas na página de venda e na plataforma de pagamento utilizada.</p>
          <p>Revenda, redistribuição ou compartilhamento não autorizado do material não são permitidos.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
