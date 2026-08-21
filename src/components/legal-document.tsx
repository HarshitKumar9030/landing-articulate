import type { ReactNode } from "react";

export type LegalSection = {
  title: string;
  body: ReactNode;
};

type LegalDocumentProps = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalDocument({ title, updated, intro, sections }: LegalDocumentProps) {
  return (
    <main className="site min-h-screen bg-(--bg) text-(--ink)">
      <div className="mx-auto w-full max-w-4xl px-6 py-24 sm:px-10 md:py-32">
        <a href="/" className="font-sans text-sm font-medium text-(--muted) no-underline transition-colors hover:text-(--ink)">
          Articulate<span className="opacity-40">X</span>
        </a>
        <header className="mt-20 border-b border-[color-mix(in_srgb,var(--ink)_12%,transparent)] pb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-(--muted)">Legal</p>
          <h1 className="mt-5 font-sans text-[clamp(48px,8vw,96px)] font-semibold leading-[0.9] tracking-tighter">{title}</h1>
          <p className="mt-8 text-sm text-(--muted)">Last updated: {updated}</p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-(--muted)">{intro}</p>
        </header>
        <div className="divide-y divide-[color-mix(in_srgb,var(--ink)_10%,transparent)]">
          {sections.map((section) => (
            <section key={section.title} className="py-10 first:pt-12">
              <h2 className="font-sans text-2xl font-semibold tracking-tight">{section.title}</h2>
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-(--muted)">{section.body}</div>
            </section>
          ))}
        </div>
        <footer className="border-t border-[color-mix(in_srgb,var(--ink)_12%,transparent)] pt-8 text-sm text-(--muted)">
          Articulate X · Mumbai, India · hello@articulatex.in
        </footer>
      </div>
    </main>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-2 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function LegalNumbered({ items }: { items: string[] }) {
  return <ol className="list-decimal space-y-2 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ol>;
}
