import { Cloud, FolderOpen, ShieldCheck, Star } from "lucide-react";
import { BuyButton } from "@/components/checkout/BuyButton";
import { VerifiedIcon } from "@/components/ui/VerifiedIcon";
import { product } from "@/lib/guide-data";
import { Countdown } from "./Countdown";
import { HeroVideo } from "./HeroVideo";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-blue-50 via-white to-white" aria-hidden="true" />
      <div className="absolute left-8 top-28 h-16 w-16 rounded-full border-[14px] border-brand-yellow/70 animate-float" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl items-center gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24 lg:pt-12">
        <div className="animate-fadeInUp">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Countdown />
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-brand-blue">
              <Star size={16} fill="currentColor" aria-hidden="true" />
              ENEM 2026
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-brand-navy sm:text-5xl lg:text-6xl">
            Guia de estudos + simulados em um Drive completo para o ENEM 2026
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tenha acesso imediato a um material organizado por pastas, com plano de estudos, conteúdos por matéria, simulados, revisão, redação e bônus para estudar com foco até o dia da prova.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BuyButton label={product.checkoutLabel} className="w-full sm:w-auto" />
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <ShieldCheck className="text-brand-green" size={20} aria-hidden="true" />
              Garantia de 7 dias e entrega digital
            </div>
          </div>

          <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
            {["Drive organizado", "Simulados completos", "Redação estratégica"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <VerifiedIcon size={20} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fadeInUp [animation-delay:160ms]">
          <div className="absolute -right-6 top-8 h-28 w-28 rounded-full bg-brand-yellow/70 blur-2xl animate-pulseSoft" aria-hidden="true" />
          <div className="absolute -left-4 bottom-12 hidden rounded-xl bg-white px-4 py-3 text-sm font-black text-brand-navy shadow-xl sm:flex sm:items-center sm:gap-2">
            <FolderOpen className="text-brand-yellow" size={22} aria-hidden="true" />
            9 pastas organizadas
          </div>
          <div className="absolute right-2 top-4 z-10 hidden rounded-xl bg-brand-blue px-4 py-3 text-sm font-black text-white shadow-xl sm:flex sm:items-center sm:gap-2">
            <Cloud size={20} aria-hidden="true" />
            Acesso via Drive
          </div>
          <HeroVideo />
        </div>
      </div>
    </section>
  );
}
