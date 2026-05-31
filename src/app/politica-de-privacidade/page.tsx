import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade do Guia Definitivo ENEM 2026.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-brand-blue">Legal</p>
        <h1 className="mt-3 text-4xl font-black text-brand-navy">Política de Privacidade</h1>
        <div className="mt-8 space-y-5 leading-8 text-slate-700">
          <p>Esta página deve ser adaptada com os dados reais da empresa, meios de contato, operador de pagamento e ferramentas utilizadas.</p>
          <p>Os dados enviados no checkout são usados para processar a compra, liberar o acesso ao produto digital e prestar suporte ao comprador.</p>
          <p>Não compartilhe dados sensíveis além do necessário para a confirmação da compra e cumprimento de obrigações legais.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
