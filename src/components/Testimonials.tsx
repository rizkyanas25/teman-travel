"use client";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

interface TestimonialItem {
  name: string;
  origin: string;
  flag: string;
  package: string;
  rating: number;
  quote: string;
  avatar: string;
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const messages = useMessages();
  const testimonialsData = messages.testimonials as { items: TestimonialItem[] };
  const items = testimonialsData.items;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="py-24 bg-dark-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-dark-700 transition backdrop-blur-sm shadow-xl hidden md:flex"
              aria-label="Scroll left"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-800/90 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-dark-700 transition backdrop-blur-sm shadow-xl hidden md:flex"
              aria-label="Scroll right"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Fade edges */}
          {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-dark-950 to-transparent z-[5] pointer-events-none" />}
          {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-dark-950 to-transparent z-[5] pointer-events-none" />}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] sm:w-[380px] snap-start bg-dark-800 rounded-2xl border border-white/10 p-6 hover:border-gold-400/20 transition-colors group"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <FaStar key={s} className="w-4 h-4 text-gold-400 shrink-0" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-4">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-gold-400/30 transition shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-white/40 text-xs truncate">{item.flag} {item.origin}</p>
                  </div>
                  <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-gold-400/10 text-gold-400 font-medium whitespace-nowrap shrink-0">
                    {item.package}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
