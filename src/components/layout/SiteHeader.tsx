"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { CartButton } from "@/components/cart/CartButton";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Coleccion" },
  { href: "/blog", label: "Blog" },
  { href: "/mayoristas", label: "Mayoristas" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const mobileNavId = "site-mobile-nav";

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <div className="shell header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-wordmark">
            <strong>EMPIRE</strong>
            <small>ESSENCE</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={isActive(link.href) ? "is-active" : undefined}>
              {link.label}
            </Link>
          ))}
          <a href="#alex" className="nav-chip">
            <Sparkles size={14} />
            Asesor Alex
          </a>
        </nav>

        <div className="header-actions">
          <CartButton />
          <Link href="/catalogo" className="primary-button compact">
            Comprar
          </Link>
          <button
            type="button"
            className="menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls={mobileNavId}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id={mobileNavId} className={`mobile-nav ${open ? "is-open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "is-active" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <a href="#alex" onClick={() => setOpen(false)}>
          Asesor Alex
        </a>
      </div>
    </header>
  );
}
