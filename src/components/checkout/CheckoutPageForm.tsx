"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, CreditCard, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { buildGuideCheckoutPayload } from "@/lib/payments/adapter";
import { product } from "@/lib/guide-data";
import { guideEventPayload, trackMetaEvent } from "@/lib/meta-pixel";
import { VerifiedIcon } from "@/components/ui/VerifiedIcon";

type PixResult = {
  pix_code?: string | null;
  pix_base64?: string | null;
  transaction_hash?: string | null;
  checkout_url?: string | null;
};

export function CheckoutPageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"error" | "success" | "info">("info");
  const [pixResult, setPixResult] = useState<PixResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setFeedback("");
    setPixResult(null);
    trackMetaEvent("InitiateCheckout", guideEventPayload);

    const formData = new FormData(event.currentTarget);
    const payload = buildGuideCheckoutPayload({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      document: String(formData.get("document") || ""),
      phone: String(formData.get("phone") || ""),
    });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível gerar o Pix.");
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      setPixResult(data);
      setFeedbackType("success");
      setFeedback("Pix gerado. Pague usando o QR Code ou o código copia e cola.");
      window.setTimeout(() => document.querySelector("#pix-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    } catch (error) {
      setFeedbackType("error");
      setFeedback(error instanceof Error ? error.message : "Erro ao iniciar checkout.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyPixCode() {
    if (!pixResult?.pix_code) return;
    await navigator.clipboard.writeText(pixResult.pix_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="min-h-screen bg-[#f3f7ff] pb-28">
      <div className="sticky top-0 z-40 flex min-h-10 items-center justify-center gap-2 bg-brand-blue px-4 text-xs font-black uppercase tracking-wide text-white shadow-lg">
        <ShieldCheck size={16} aria-hidden="true" />
        Pagamento 100% seguro
      </div>

      <section className="mx-auto max-w-[460px] overflow-hidden bg-white shadow-xl lg:mt-6 lg:rounded-2xl">
        <div className="relative h-28 bg-brand-navy">
          <Image
            src="/images/enem-checkout-banner.png"
            alt="ENEM"
            fill
            priority
            sizes="460px"
            className="object-cover"
          />
        </div>

        <div className="space-y-5 p-3 sm:p-5">
          <form id="checkout-form" className="space-y-5" onSubmit={handleSubmit}>
            <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm animate-fadeInUp">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-blue text-sm font-black text-white">1</span>
                <div>
                  <h1 className="text-xl font-black text-brand-navy">Identifique-se</h1>
                  <p className="text-sm font-semibold text-slate-500">Informe seus dados para receber o Drive completo.</p>
                </div>
              </div>

              <label className="block text-sm font-bold text-slate-700">
                Nome completo
                <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100">
                  <UserRound size={18} className="text-slate-400" aria-hidden="true" />
                  <input name="name" required autoComplete="name" className="h-full min-w-0 flex-1 border-0 bg-transparent outline-none" placeholder="Seu nome completo" />
                </div>
              </label>

              <label className="mt-4 block text-sm font-bold text-slate-700">
                E-mail
                <div className="mt-2 flex h-12 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-100">
                  <Mail size={18} className="text-slate-400" aria-hidden="true" />
                  <input name="email" type="email" required autoComplete="email" className="h-full min-w-0 flex-1 border-0 bg-transparent outline-none" placeholder="seu@email.com" />
                </div>
              </label>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  CPF
                  <input name="document" className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100" placeholder="000.000.000-00" />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  WhatsApp
                  <input name="phone" className="mt-2 h-12 w-full rounded-lg border border-slate-200 px-4 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-blue-100" placeholder="(00) 00000-0000" />
                </label>
              </div>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm animate-fadeInUp [animation-delay:120ms]">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-bold text-slate-600">Você está adquirindo:</p>
                <div className="mt-3 grid grid-cols-[76px_1fr] items-center gap-3">
                  <Image src="/images/enem-drive-offer.png" alt="" width={76} height={92} className="h-[76px] w-[76px] rounded-lg object-cover" />
                  <div>
                    <strong className="block text-base font-black leading-tight text-brand-navy">{product.name}</strong>
                    <small className="mt-1 block font-bold text-slate-600">Guia + simulados + Drive completo</small>
                    <span className="mt-2 block text-sm font-black text-brand-blue">{product.priceLabel}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-brand-blue">
                  <CreditCard size={17} aria-hidden="true" />
                  Pagamento via Pix
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Após a confirmação do pagamento, o acesso ao Drive completo será liberado pelo e-mail informado acima.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <strong className="text-lg font-black text-brand-navy">Total:</strong>
                <b className="text-2xl font-black text-brand-blue">{product.priceLabel}</b>
              </div>
            </section>

            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <div className="grid gap-3 text-sm font-bold text-slate-700">
                {["Dados protegidos", "Compra segura", "Garantia de 7 dias"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <VerifiedIcon size={22} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {feedback ? (
              <p className={`rounded-lg p-3 text-sm font-bold ${feedbackType === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`} role="status">
                {feedback}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="fixed inset-x-4 bottom-4 z-40 mx-auto h-14 max-w-[430px] rounded-xl bg-brand-yellow font-black text-brand-navy shadow-2xl shadow-yellow-300/40 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-70 animate-pulseSoft"
            >
              {isLoading ? "Gerando Pix..." : `Gerar Pix - ${product.priceLabel}`}
            </button>
          </form>

          {pixResult ? (
            <section id="pix-result" className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-brand-navy">Pix gerado</h2>
              <div className="mt-4 grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                {pixResult.pix_base64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pixResult.pix_base64.startsWith("data:") ? pixResult.pix_base64 : `data:image/png;base64,${pixResult.pix_base64}`}
                    alt="QR Code Pix"
                    className="h-52 w-52 object-contain"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold text-slate-500">QR Code indisponível. Use o código Pix copia e cola.</span>
                )}
              </div>
              {pixResult.pix_code ? (
                <label className="mt-4 block text-sm font-bold text-slate-700">
                  Código Pix copia e cola
                  <textarea readOnly value={pixResult.pix_code} className="mt-2 h-28 w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none" />
                </label>
              ) : null}
              <button type="button" onClick={copyPixCode} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-blue font-black text-white transition hover:bg-blue-700">
                <Copy size={18} aria-hidden="true" />
                {copied ? "Código copiado" : "Copiar código Pix"}
              </button>
            </section>
          ) : null}

          <aside className="grid gap-3 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
            <TrustItem title="Dados protegidos" text="As informações da compra são tratadas com segurança." />
            <TrustItem title="Conteúdo digital" text="Material organizado para estudar no celular ou computador." />
            <TrustItem title="Garantia de 7 dias" text="Você tem segurança para testar o material." />
          </aside>
        </div>
      </section>
    </main>
  );
}

function TrustItem({ title, text }: { title: string; text: string }) {
  return (
    <article className="flex gap-3 rounded-lg bg-blue-50 p-3">
      <Lock className="mt-0.5 shrink-0 text-brand-blue" size={18} aria-hidden="true" />
      <div>
        <strong className="block text-sm font-black text-brand-navy">{title}</strong>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{text}</p>
      </div>
    </article>
  );
}
