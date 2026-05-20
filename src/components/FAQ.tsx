"use client";
import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FiChevronDown } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";



export default function FAQ() {
  const t = useTranslations("faq");
  const messages = useMessages() as unknown as IntlMessages;
  const items = messages.faq.items;

  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const tc = useTranslations("common");
  
  const whatsappUrl = getWhatsAppUrl(tc("whatsappGenericMessage"));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 bg-dark-900 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50">{t("subtitle")}</p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`glass transition-all duration-300 rounded-2xl border ${
                  isOpen ? "border-gold-400/30 bg-dark-800/80" : "border-white/10 bg-dark-800/40 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-base sm:text-lg pr-8 transition-colors ${isOpen ? "text-gold-400" : "text-white"}`}>
                    {item.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "border-gold-400 text-gold-400 rotate-180" : "border-white/20 text-white/60"
                  }`}>
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <div 
                  className={`faq-content ${
                    isOpen ? "open" : ""
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className="p-6 pt-0 text-white/60 leading-relaxed text-sm sm:text-base">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm mb-4">{t("stillHaveQuestions")}</p>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#25D366]/50 text-[#25D366] rounded-full font-semibold hover:bg-[#25D366]/10 hover:border-[#25D366] transition"
          >
            <FaWhatsapp className="w-5 h-5" />
            {t("chatUs")}
          </a>
        </div>
      </div>
    </section>
  );
}
