import Image from "next/image";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/guide-data";
import { SectionHeader } from "./SectionHeader";

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="bg-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Depoimentos"
          title="Feedbacks de quem já organizou os estudos"
          description="Relatos em formato editável para você trocar por depoimentos reais dos seus compradores quando quiser."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt={`Foto de ${testimonial.name}`}
                    width={52}
                    height={52}
                    className="h-[52px] w-[52px] shrink-0 rounded-full object-cover ring-4 ring-blue-50"
                  />
                  <div className="min-w-0">
                    <strong className="block truncate text-base font-black text-brand-navy">{testimonial.name}</strong>
                    <span className="block truncate text-sm font-semibold text-slate-500">{testimonial.role}</span>
                  </div>
                </div>
                <div className="flex shrink-0 text-brand-yellow" aria-label="5 estrelas">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
              </div>
              <p className="text-base leading-7 text-slate-700">&ldquo;{testimonial.text}&rdquo;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
