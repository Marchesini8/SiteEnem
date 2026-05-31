import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-navy pb-28 pt-10 text-white md:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <strong className="text-lg">Guia Definitivo ENEM 2026</strong>
          <p className="mt-1 text-sm text-blue-100">Produto digital independente de preparação para estudos.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-blue-100" aria-label="Links do rodape">
          <a className="transition hover:text-brand-yellow" href="/politica-de-privacidade">Política de privacidade</a>
          <a className="transition hover:text-brand-yellow" href="/termos-de-uso">Termos de uso</a>
          <a className="inline-flex items-center gap-2 transition hover:text-brand-yellow" href="mailto:contato@seudominio.com">
            <Mail size={16} aria-hidden="true" />
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}
