import { VerifiedIcon } from "@/components/ui/VerifiedIcon";
import { guideContents } from "@/lib/guide-data";
import { SectionHeader } from "./SectionHeader";

export function GuideContentSection() {
  return (
    <section id="conteudo" className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeader
          eyebrow="Conteúdo do Drive"
          title="Guia, simulados e materiais de apoio em um só lugar"
          description="Perfeito para montar sua rotina no celular ou computador e saber exatamente o que estudar, revisar e treinar a cada semana."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {guideContents.map((content) => (
            <div key={content} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              <VerifiedIcon size={24} className="mt-0.5" />
              <span className="font-bold text-slate-700">{content}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
