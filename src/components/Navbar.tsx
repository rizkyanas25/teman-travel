"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("navbar");

  const navLinks = [
    { href: "#home", label: t("home") },
    { href: "#about", label: t("about") },
    { href: "#packages", label: t("packages") },
    { href: "#gallery", label: t("gallery") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Teman Travel" width={48} height={48} className="rounded-lg" />
            <span className="font-[family-name:var(--font-display)] text-xl font-bold text-gold-400">Teman Travel</span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-gold-400 transition">
                {link.label}
              </a>
            ))}
            <LanguageSwitcher />
            <a href="#contact" className="px-5 py-2.5 bg-gold-400 text-dark-900 rounded-full text-sm font-semibold hover:bg-gold-300 transition">
              {t("contact")}
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white focus:outline-none" aria-label="Toggle menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-sm text-white/80 hover:text-gold-400 transition py-2">
                {link.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm text-gold-400 font-semibold py-2">
              {t("contact")}
            </a>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
