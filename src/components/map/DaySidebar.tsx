import { PACKAGE_GEO_DATA, getDayStops } from '@/data/itinerary-geo';
import { FiCheck, FiCompass } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { NEARBY_POIS } from '@/data/nearby-pois';
import PoiCard from './PoiCard';

interface DaySidebarProps {
  packageIndex: number;
  activeDayIndex: number;
  onSelectDay: (index: number) => void;
  dayTitles: string[];
  dayLabels: string[];
  activeStopIndex?: number; // -1 = none, 999 = all reached (completed)
  completedDays?: Set<number>;
  isPlaying?: boolean;
  isTransit?: boolean;
  selectedStopIndex?: number | null;
  onStopSelect?: (stopIndex: number) => void;
}

export default function DaySidebar({
  packageIndex,
  activeDayIndex,
  onSelectDay,
  dayTitles,
  dayLabels,
  activeStopIndex = -1,
  completedDays = new Set(),
  isPlaying = false,
  isTransit = false,
  selectedStopIndex = null,
  onStopSelect,
}: DaySidebarProps) {
  const t = useTranslations('packages');
  const pkgData = PACKAGE_GEO_DATA.find((p) => p.packageIndex === packageIndex);

  if (!pkgData) return null;

  // Find the next uncompleted day (for pulse hint)
  const nextUncompletedIdx =
    pkgData.days.find(
      (d) => !completedDays.has(d.dayIndex) && d.dayIndex !== activeDayIndex,
    )?.dayIndex ?? -1;
  // Only pulse next day bullet if the current active day IS completed
  const shouldPulseNextDay =
    completedDays.has(activeDayIndex) && nextUncompletedIdx >= 0;

  return (
    <div className='h-full overflow-y-auto px-6 py-6 custom-scrollbar'>
      <div className='space-y-6 relative'>
        {pkgData.days.map((day, idx) => {
          const isActive = activeDayIndex === day.dayIndex;
          const isCompleted = completedDays.has(day.dayIndex);
          const isPast = day.dayIndex < activeDayIndex;
          const dayLabel = dayLabels[idx] || `Day ${day.dayIndex + 1}`;
          const stops = getDayStops(day);
          const shouldPulseBullet =
            shouldPulseNextDay && day.dayIndex === nextUncompletedIdx;
          const isLastDay = idx === pkgData.days.length - 1;

          return (
            <div key={day.dayIndex} className='relative'>
              {/* Per-item Timeline Connecting Line */}
              {!isLastDay && (
                <div className='absolute top-[24px] bottom-[-24px] left-[11px] w-0.5 bg-white/10' />
              )}

              {/* Day Header: Flex container ensures perfect vertical alignment */}
              <div
                className={`flex items-center gap-3 transition-opacity duration-300 cursor-pointer ${isActive ? 'opacity-100' : isCompleted ? 'opacity-70 hover:opacity-90' : 'opacity-50 hover:opacity-80'}`}
                onClick={() => onSelectDay(day.dayIndex)}
              >
                {/* Timeline Node */}
                <div className='relative z-10 w-6 h-6 shrink-0 flex items-center justify-center'>
                  {/* Pulse rings on next-day bullet */}
                  {shouldPulseBullet && (
                    <>
                      <span className='absolute inset-0 rounded-full bg-gold-400/40 animate-[pulseRing_2s_ease-out_infinite]' />
                      <span className='absolute inset-0 rounded-full bg-gold-400/20 animate-[pulseRing_2s_ease-out_0.6s_infinite]' />
                    </>
                  )}
                  <button
                    className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'ring-4 ring-dark-800 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : isCompleted
                          ? 'bg-green-500 hover:bg-green-400'
                          : isPast
                            ? 'bg-white/40 hover:bg-white/60'
                            : 'bg-dark-800 border-2 border-white/20 hover:border-white/40'
                    }`}
                    style={{
                      backgroundColor: isActive ? day.color : undefined,
                    }}
                  >
                    {isActive && (
                      <div className='w-2 h-2 bg-dark-900 rounded-full' />
                    )}
                    {!isActive && isCompleted && (
                      <FiCheck className='w-4 h-4 text-white' />
                    )}
                  </button>
                </div>

                {/* Text Content */}
                <h4 className='text-sm font-bold flex items-center gap-2 m-0 leading-none w-full min-w-0'>
                  <span
                    className='whitespace-nowrap shrink-0'
                    style={{
                      color: isActive
                        ? day.color
                        : isCompleted
                          ? '#4ade80'
                          : '#fff',
                    }}
                  >
                    {dayLabel}
                  </span>
                  <span className='text-white/40 font-normal shrink-0'>—</span>
                  <span className='text-white/80 line-clamp-1 flex-1 min-w-0'>
                    {dayTitles[idx] || dayLabel}
                  </span>
                </h4>
              </div>

              {/* Day Details (Stops) */}
              {isActive && (
                <div className='pl-9 mt-3 space-y-3.5 animate-[fadeInUp_0.3s_ease]'>
                  {stops.map((stop, sIdx) => {
                    const isReached = activeStopIndex >= sIdx;
                    const isCurrent = isPlaying
                      ? isTransit
                        ? activeStopIndex + 1 === sIdx
                        : activeStopIndex === sIdx
                      : activeStopIndex === sIdx;
                    const isEnRoute = isPlaying && isTransit && activeStopIndex + 1 === sIdx;
                    const isSelected = selectedStopIndex === sIdx;
                    const pois = NEARBY_POIS[stop.name] || [];

                    return (
                      <div key={sIdx} className='space-y-2'>
                        {/* Stop Header Clickable */}
                        <div
                          className={`flex items-start gap-2.5 text-xs transition-all duration-300 cursor-pointer ${
                            isCurrent || isSelected
                              ? 'opacity-100'
                              : isReached || isEnRoute
                                ? 'opacity-90 hover:opacity-100'
                                : 'opacity-45 hover:opacity-75'
                          }`}
                          onClick={() => onStopSelect?.(sIdx)}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                              isCurrent || isSelected ? 'scale-110 ring-2 ring-white/30' : ''
                            } ${
                              isEnRoute
                                ? 'animate-pulse ring-2 ring-white/40'
                                : ''
                            }`}
                            style={{
                              backgroundColor:
                                isReached || isEnRoute || isSelected
                                  ? day.color
                                  : 'rgba(255,255,255,0.15)',
                              color:
                                isReached || isEnRoute || isSelected
                                  ? '#000'
                                  : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {isReached ? (
                              <span className='font-bold text-[9px]'>✓</span>
                            ) : (
                              <span className='font-bold text-[9px]'>
                                {sIdx + 1}
                              </span>
                            )}
                          </div>
                          
                          <div className='flex flex-col min-w-0 mt-0.5'>
                            <span
                              className={`leading-snug transition-colors duration-300 ${
                                isCurrent || isSelected
                                  ? 'text-white font-bold'
                                  : isEnRoute
                                    ? 'text-white font-medium animate-pulse'
                                    : isReached
                                      ? 'text-white/80'
                                      : 'text-white/40'
                              } ${isSelected ? 'font-extrabold scale-105 inline-block origin-left' : ''}`}
                              style={{
                                color: isSelected ? day.color : undefined
                              }}
                            >
                              {stop.name}
                            </span>
                            
                            {/* Tap to explore hint (only when not selected) */}
                            {!isSelected && (
                              <span className='text-[9px] text-white/25 hover:text-white/45 transition-opacity duration-300 mt-0.5'>
                                {t('exploreNearbyHint')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Glassmorphic Local POI Accordion */}
                        {!isPlaying && isSelected && (
                          <div className='pl-7 pr-1 w-full animate-[fadeInUp_0.25s_ease-out]'>
                            <div className='backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-3 space-y-2.5 shadow-lg shadow-black/20'>
                              <div className='flex items-center gap-1.5 text-[9px] font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-1.5'>
                                <FiCompass className='w-3.5 h-3.5 animate-spin-slow' style={{ color: day.color }} />
                                {t('nearbyPoisTitle')}
                              </div>
                              
                              {pois.length > 0 ? (
                                <div className='space-y-2'>
                                  {pois.map((poi, pIdx) => {
                                    let catLabel = t('categoryActivity');
                                    if (poi.category === 'food') catLabel = t('categoryFood');
                                    if (poi.category === 'photo') catLabel = t('categoryPhoto');
                                    if (poi.category === 'cafe') catLabel = t('categoryCafe');

                                    return (
                                      <PoiCard
                                        key={pIdx}
                                        poi={poi}
                                        dayColor={day.color}
                                        tCategory={catLabel}
                                        tMapsLink={t('mapsLink')}
                                      />
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className='text-[10px] text-white/35 italic pl-0.5 py-1'>
                                  {t('nearbyPoisEmpty')}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
