import { faqItems } from "@/lib/guide-data";
import { SectionHeader } from "./SectionHeader";

export function FaqSection() {
  return (
    <section id="faq" className="bg-blue-50 py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Perguntas frequentes"
          description="Respostas rapidas para reduzir duvidas antes da compra."
        />
        <div className="mt-10 space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="group rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none text-lg font-black text-brand-navy">
                {item.question}
              </summary>
              <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
