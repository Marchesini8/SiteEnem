import { ShieldCheck } from "lucide-react";

export function GuaranteeSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid gap-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm sm:grid-cols-[auto_1fr] sm:p-8">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-brand-blue text-white">
            <ShieldCheck size={34} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-brand-blue">Garantia</p>
            <h2 className="mt-2 text-3xl font-black text-brand-navy">7 dias para testar sem risco</h2>
            <p className="mt-3 text-lg leading-8 text-slate-600">
              Você compra com segurança. Se o material não fizer sentido para sua rotina de estudos, a garantia de 7 dias protege sua decisão conforme os termos da oferta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
