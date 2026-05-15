"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";

import { Link } from "@/i18n/navigation";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("navbar");

  const navLinks = [
    { href: "/#home", label: t("home") },
    { href: "/#about", label: t("about") },
    { href: "/#packages", label: t("packages") },
    { href: "/#gallery", label: t("gallery") },
    { href: "/#testimonials", label: t("testimonials") },
    { href: "/#faq", label: t("faq") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isGlass = scrolled || menuOpen;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isGlass 
        ? "bg-[rgba(10,28,25,0.7)] backdrop-blur-xl border-white/5 shadow-2xl" 
        : "bg-transparent backdrop-blur-none border-transparent shadow-none"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logomark-nobg.png" alt="Teman Travel Logo" width={60} height={60} className="w-10 h-10 object-contain" />
            <Image src="/images/logotype-nobg.png" alt="Teman Travel" width={200} height={60} className="w-auto h-7 object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-gold-400 transition">
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="lg:hidden text-white focus:outline-none flex items-center justify-center h-10 w-10" 
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Premium Mobile Menu Dropdown */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-2 border-t border-white/5">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMenuOpen(false)} 
              className="block text-base font-medium text-white/80 hover:text-gold-400 transition py-3 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-6 mt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white/50">Language</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
