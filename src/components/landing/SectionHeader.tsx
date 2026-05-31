type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-black uppercase tracking-wide text-brand-blue">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-brand-navy sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p> : null}
    </div>
  );
}
