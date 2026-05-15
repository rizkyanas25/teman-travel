import { useTranslations } from "next-intl";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FaPlay, FaPause, FaWhatsapp } from "react-icons/fa";
interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  currentDayLabel: string;
  totalDays: number;
  stopCount: number;
  shouldPulse?: boolean;
  packageTitle?: string;
}

export default function PlaybackControls({ isPlaying, onPlayToggle, currentDayLabel, totalDays, stopCount, shouldPulse = false, packageTitle }: PlaybackControlsProps) {
  const t = useTranslations("packages");
  const tc = useTranslations("common");

  return (
    <div className="bg-dark-800/95 backdrop-blur-sm border-t border-white/10 px-4 py-3 md:px-6 md:py-4 z-20 shrink-0">
      <div className="flex items-center justify-between gap-3 md:gap-4">
        
        {/* Left Side: Play Button */}
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
            className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-gold-400 text-dark-900 hover:bg-gold-300 transition-colors shadow-[0_0_20px_rgba(212,168,67,0.3)]"
            title={isPlaying ? t("pauseJourney") : t("playJourney")}
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4 md:w-4 md:h-4" />
            ) : (
              <FaPlay className="w-4 h-4 md:w-4 md:h-4 pl-0.5" />
            )}
          </button>
        </div>

        {/* Middle: Day Info */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm md:text-base font-bold text-white truncate">
            {currentDayLabel}
          </span>
          <span className="text-xs md:text-sm text-white/50 truncate">
            📍 {stopCount} {t("stops")}
          </span>
        </div>

        {/* Right Side: Book CTA */}
        <a 
          href={getWhatsAppUrl(packageTitle ? tc("whatsappBookMessage", { title: packageTitle }) : tc("whatsappGenericMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center justify-center h-10 px-4 md:h-11 md:px-5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 rounded-xl transition-colors text-[#25D366]"
          title={tc("bookNow")}
        >
          <FaWhatsapp className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="font-medium ml-2 text-sm md:text-base">
            <span className="md:hidden">{tc("bookNow")}</span>
            <span className="hidden md:inline">{tc("bookNow").split(' ')[0]}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
