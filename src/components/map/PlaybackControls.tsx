import { useTranslations } from "next-intl";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  currentDayLabel: string;
  totalDays: number;
  stopCount: number;
  shouldPulse?: boolean;
}

export default function PlaybackControls({ isPlaying, onPlayToggle, currentDayLabel, totalDays, stopCount, shouldPulse = false }: PlaybackControlsProps) {
  const t = useTranslations("packages");
  const tc = useTranslations("common");

  return (
    <div className="bg-dark-800/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 md:px-6 md:py-4 z-20 shrink-0">
      <div className="flex items-center gap-3">
        {/* Play/Pause Button with optional pulse */}
        <div className="relative shrink-0">
          {/* Pulse rings */}
          {shouldPulse && !isPlaying && (
            <>
              <span className="absolute inset-0 rounded-full bg-gold-400/40 animate-[pulseRing_2s_ease-out_infinite]" />
              <span className="absolute inset-0 rounded-full bg-gold-400/20 animate-[pulseRing_2s_ease-out_0.6s_infinite]" />
            </>
          )}
          <button
            onClick={onPlayToggle}
            className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-400 text-dark-900 hover:bg-gold-300 transition-colors shadow-[0_0_20px_rgba(212,168,67,0.3)]"
            title={isPlaying ? t("pauseJourney") : t("playJourney")}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.906 4.537A1 1 0 005 5.36v13.28a1 1 0 001.906.823l11.18-6.64a1 1 0 000-1.646L6.906 4.537z" />
              </svg>
            )}
          </button>
        </div>

        {/* Day Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-bold text-white truncate">
            {currentDayLabel}
          </span>
          <span className="text-xs text-white/50">
            📍 {stopCount} {t("stops")}
          </span>
        </div>

        {/* Book CTA */}
        <a 
          href="#kontak-kami" 
          className="shrink-0 px-4 py-2 md:px-6 md:py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs md:text-sm font-medium transition-colors text-center whitespace-nowrap"
        >
          {tc("bookNow")}
        </a>
      </div>
    </div>
  );
}
