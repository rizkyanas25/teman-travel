"use client";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useMessages } from "next-intl";
import DaySidebar from "./map/DaySidebar";
import PlaybackControls from "./map/PlaybackControls";
import MapView, { MapViewHandle } from "./map/MapView";
import { PACKAGE_GEO_DATA, getDayStops } from "@/data/itinerary-geo";
import { FiX } from "react-icons/fi";

interface Props {
  packageIndex: number | null;
  onClose: () => void;
}

export default function ItineraryMapModal({ packageIndex, onClose }: Props) {
  const t = useTranslations("packages");
  const messages = useMessages() as unknown as IntlMessages;
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStopIndex, setActiveStopIndex] = useState(-1);
  const [isTransit, setIsTransit] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [prevPackage, setPrevPackage] = useState<number | null>(null);
  const mapRef = useRef<MapViewHandle>(null);

  useEffect(() => {
    if (packageIndex === null) return;

    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";

      // Temporarily disable smooth scroll on html to prevent visual jump/glide
      const htmlStyle = document.documentElement.style;
      const originalScrollBehavior = htmlStyle.scrollBehavior;
      htmlStyle.scrollBehavior = "auto";

      window.scrollTo(0, scrollY);

      // Restore original scroll behavior after a brief layout settle
      htmlStyle.scrollBehavior = originalScrollBehavior;
    };
  }, [packageIndex]);

  // Synchronous reset when package changes — uses state (safe to read during render)
  if (packageIndex !== null && packageIndex !== prevPackage) {
    setPrevPackage(packageIndex);
    if (activeDayIndex !== 0) setActiveDayIndex(0);
    if (isPlaying) setIsPlaying(false);
    if (activeStopIndex !== -1) setActiveStopIndex(-1);
    if (isTransit) setIsTransit(false);
    if (!shouldPulse) setShouldPulse(true);
    if (completedDays.size > 0) setCompletedDays(new Set());
  }

  if (packageIndex === null) return null;

  const pkgData = messages.packages.items[packageIndex];
  const geoData = PACKAGE_GEO_DATA.find(p => p.packageIndex === packageIndex);

  if (!pkgData || !geoData) return null;

  const dayTitles = pkgData.itinerary.map((d) => d.title);
  const dayLabels = pkgData.itinerary.map((d) => d.day);
  const currentDayGeo = geoData.days.find(d => d.dayIndex === activeDayIndex);
  const stopCount = currentDayGeo ? getDayStops(currentDayGeo).length : 0;
  const currentDayLabel = dayLabels[activeDayIndex] || `Day ${activeDayIndex + 1}`;

  const handleSelectDay = (idx: number) => {
    setActiveDayIndex(idx);
    setIsPlaying(false);
    setActiveStopIndex(-1);
    setIsTransit(false);
    // Pulse play button when switching to a non-completed day
    setShouldPulse(!completedDays.has(idx));
    if (mapRef.current) {
      mapRef.current.pauseAnimation();
      mapRef.current.flyToDay(idx);
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsTransit(false);
      if (mapRef.current) mapRef.current.pauseAnimation();
    } else {
      setIsPlaying(true);
      setShouldPulse(false);
      setActiveStopIndex(-1);
      setIsTransit(false);
      if (mapRef.current) {
        mapRef.current.flyToDay(activeDayIndex);
        setTimeout(() => {
           if (mapRef.current) mapRef.current.playAnimation(activeDayIndex);
        }, 500);
      }
    }
  };

  const handleAnimationEnd = () => {
    setIsPlaying(false);
    setIsTransit(false);

    // Mark this day as completed — highlights persist
    setCompletedDays(prev => new Set(prev).add(activeDayIndex));

    // No auto-advance. Play pulse off, next day bullet will pulse in sidebar.
    setShouldPulse(false);
  };

  const handleStopReached = (stopIndex: number) => {
    setActiveStopIndex(stopIndex);
    setIsTransit(false);
  };

  const handleDepartStop = () => {
    setIsTransit(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center lg:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div 
        className="relative w-full h-[100dvh] lg:w-[95vw] lg:h-[90vh] lg:max-h-[900px] lg:max-w-[1400px] bg-dark-800 flex flex-col lg:rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-[fadeInUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-800/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between z-10 shrink-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-white flex items-center gap-2">
            {pkgData.title} <span className="hidden sm:inline text-white/40 font-normal text-base">— {t("mapTitle")}</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          
          {/* Map Area */}
          <div className="relative order-1 lg:order-2 flex-1 h-[50%] lg:h-auto" style={{ minHeight: '300px' }}>
             <MapView 
                key={packageIndex}
                ref={mapRef} 
                packageIndex={packageIndex} 
                activeDayIndex={activeDayIndex}
                onAnimationEnd={handleAnimationEnd}
                onStopReached={handleStopReached}
                onDepartStop={handleDepartStop}
             />
          </div>

          {/* Sidebar Area */}
          <div className="w-full lg:w-[380px] bg-dark-800 flex flex-col order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/10 h-[50%] lg:h-full shrink-0 z-10 pb-[env(safe-area-inset-bottom)] lg:pb-0">
            {/* Timeline */}
            <div className="flex-1 overflow-hidden min-h-0">
              <DaySidebar 
                packageIndex={packageIndex} 
                activeDayIndex={activeDayIndex} 
                onSelectDay={handleSelectDay}
                dayTitles={dayTitles}
                dayLabels={dayLabels}
                activeStopIndex={isPlaying ? activeStopIndex : (completedDays.has(activeDayIndex) ? 999 : -1)}
                completedDays={completedDays}
                isPlaying={isPlaying}
                isTransit={isTransit}
              />
            </div>

            {/* Playback Controls */}
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlayToggle={handlePlayToggle}
              currentDayLabel={currentDayLabel}
              stopCount={stopCount}
              shouldPulse={shouldPulse}
              packageTitle={pkgData.title}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
