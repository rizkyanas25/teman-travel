"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  const t = useTranslations("contact");
  const [showBubble1, setShowBubble1] = useState(false);
  const [showBubble2, setShowBubble2] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          setTimeout(() => setShowBubble1(true), 400);
          setTimeout(() => setShowBubble2(true), 1600);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById("wa-chat-card");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const waUrl = getWhatsAppUrl(t("chatGenericMessage"));

  return (
    <section id="contact" className="py-24 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                <FiMapPin className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("addressLabel")}</h4>
                <p className="text-white/50 text-sm">{t("address")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                <FiPhone className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("phoneLabel")}</h4>
                <a href={getWhatsAppUrl()} className="text-gold-400 text-sm hover:underline" target="_blank" rel="noopener noreferrer">+62 888-666-2507</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center shrink-0">
                <FiMail className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">{t("emailLabel")}</h4>
                <p className="text-gold-400 text-sm">info@temantravel.com</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 transition" aria-label="Facebook">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 transition" aria-label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full glass flex items-center justify-center text-white/70 hover:text-gold-400 transition" aria-label="TikTok">
                <FaTiktok className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right: WhatsApp Chat Preview Card */}
          <div
            id="wa-chat-card"
            className="relative bg-dark-800 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#075E54] px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{t("chatTitle")}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="text-white/70 text-xs">Online</span>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-6 space-y-4 min-h-[240px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] bg-repeat">
              {/* Customer Bubble */}
              <div
                className={`flex justify-end transition-all duration-500 ${
                  showBubble1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="max-w-[80%] bg-[#005C4B] rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                  <p className="text-white/90 text-sm leading-relaxed">{t("chatBubbleCustomer")}</p>
                  <p className="text-white/40 text-[10px] text-right mt-1">09:41 ✓✓</p>
                </div>
              </div>

              {/* Reply Bubble */}
              <div
                className={`flex justify-start transition-all duration-500 ${
                  showBubble2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className="max-w-[80%] bg-dark-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-white/5">
                  <p className="text-[#25D366] text-xs font-semibold mb-1">Teman Travel</p>
                  <p className="text-white/90 text-sm leading-relaxed">{t("chatBubbleReply")}</p>
                  <p className="text-white/40 text-[10px] text-right mt-1">09:41</p>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 pb-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
                <span>⚡</span>
                <span>{t("responseTime")}</span>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
              >
                <FaWhatsapp className="w-5 h-5" />
                {t("chatNow")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
