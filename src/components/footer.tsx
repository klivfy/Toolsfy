"use client";

import Link from "next/link";
import { type MouseEvent } from "react";

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
];

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4.2c0-1.5 1-2.3 2.3-2.3 1.3 0 2.2.8 2.2 2.3V17" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram", icon: InstagramIcon },
  { href: "#", label: "LinkedIn", icon: LinkedinIcon },
  { href: "#", label: "X", icon: XIcon },
];

function handleEmptyLinkClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.currentTarget.getAttribute("href") === "#") {
    event.preventDefault();
  }
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-6 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
      <div className="flex flex-col gap-4 text-xs text-zinc-500 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            © 2026 Mestry&apos;s Tecnologia e Consultoria em TI LTDA. Todos os
            direitos reservados.
          </p>
          <p>CNPJ: 68.027.889/0001-34</p>
          <p>Rua Pais Leme, 215, Conj 1713, Pinheiros, São Paulo/SP</p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <nav className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  onClick={handleEmptyLinkClick}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
