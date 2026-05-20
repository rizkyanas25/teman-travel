"use client";
import { useState, useCallback, useEffect } from "react";
import { useTranslations, useMessages } from "next-intl";
import Image from "next/image";
import { FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Gallery() {
  const t = useTranslations("gallery");
  const messages = useMessages() as unknown as IntlMessages;
  const destinations = messages.gallery.destinations;
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [destinations.length]);

  const prev = () => {
    const idx = current === 0 ? destinations.length - 1 : current - 1;
    goTo(idx);
  };

  const next = () => {
    const idx = current === destinations.length - 1 ? 0 : current + 1;
    goTo(idx);
  };

  const dest = destinations[current];

  return (
    <section id="gallery" className="py-24 bg-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-400 font-medium tracking-widest uppercase text-sm mb-3">{t("badge")}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-4">
            {t.rich("heading", {
              highlight: (chunks) => <span className="text-gold-400">{chunks}</span>,
            })}
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>

        {/* Carousel */}
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-0 items-stretch bg-dark-800 rounded-2xl border border-white/10 overflow-hidden min-h-[400px] lg:min-h-[480px]">
          {/* Image side */}
          <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden">
            <Image
              key={dest.image}
              src={dest.image}
              alt={dest.title}
              fill
              className="object-cover carousel-img"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-dark-800/30" />

            {/* Location badge on image */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              <FiMapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="text-xs text-white/90 font-medium">{dest.location}</span>
            </div>
          </div>

          {/* Content side */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-2 hidden sm:block">
                {String(current + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white mb-4">
                {dest.title}
              </h3>
              <p className="text-white/50 leading-relaxed text-sm sm:text-base">
                {dest.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {/* Dot indicators (Desktop) */}
              <div className="hidden sm:flex gap-2">
                {destinations.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === current
                        ? "w-8 h-2 bg-gold-400"
                        : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Number indicator (Mobile) */}
              <div className="sm:hidden text-gold-400 text-sm font-semibold tracking-widest uppercase">
                {String(current + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}
              </div>

              {/* Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold-400 hover:text-gold-400 transition"
                  aria-label={t("prev")}
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-gold-400 hover:text-gold-400 transition"
                  aria-label={t("next")}
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
