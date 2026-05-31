import { DriveIcon } from "@/components/ui/DriveIcon";
import { IconImage } from "@/components/ui/IconImage";
import { benefits } from "@/lib/guide-data";
import { SectionHeader } from "./SectionHeader";

const icons = [
  { type: "drive" as const, src: "" },
  { type: "image" as const, src: "/images/calendar-icon.png" },
  { type: "image" as const, src: "/images/brain-icon.png" },
  { type: "image" as const, src: "/images/pencil-icon.png" },
  { type: "image" as const, src: "/images/documents-icon.png" },
];

export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-blue-50 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Benefícios"
          title="Tudo organizado para você estudar com direção"
          description="Um Drive completo para transformar matéria solta em uma rotina de preparação com guia, simulados e revisão."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((benefit, index) => {
            const icon = icons[index] || icons[4];
            const isDrive = index === 0;

            return (
              <article key={benefit} className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-white shadow-md ring-1 ring-blue-100">
                  {icon.type === "drive" ? (
                    <DriveIcon size={32} />
                  ) : (
                    <IconImage src={icon.src} size={isDrive ? 32 : 34} />
                  )}
                </div>
                <h3 className="mt-4 text-base font-black leading-snug text-brand-navy">{benefit}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
