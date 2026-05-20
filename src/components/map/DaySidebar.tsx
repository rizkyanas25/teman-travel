import { PACKAGE_GEO_DATA, getDayStops } from '@/data/itinerary-geo';
import { FiCheck } from 'react-icons/fi';

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
}: DaySidebarProps) {
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
                <div className='pl-9 mt-3 space-y-2 animate-[fadeInUp_0.3s_ease]'>
                  {stops.map((stop, sIdx) => {
                    const isReached = activeStopIndex >= sIdx;
                    const isCurrent = isPlaying
                      ? isTransit
                        ? activeStopIndex + 1 === sIdx
                        : activeStopIndex === sIdx
                      : activeStopIndex === sIdx;
                    const isEnRoute = isPlaying && isTransit && activeStopIndex + 1 === sIdx;

                    return (
                      <div
                        key={sIdx}
                        className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                          isReached || isEnRoute ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                            isCurrent ? 'scale-125 ring-2 ring-white/30' : ''
                          } ${
                            isEnRoute
                              ? 'animate-pulse ring-2 ring-white/40'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              isReached || isEnRoute
                                ? day.color
                                : 'rgba(255,255,255,0.15)',
                            color:
                              isReached || isEnRoute
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
                        <span
                          className={`leading-snug mt-0.5 transition-colors duration-300 ${
                            isCurrent
                              ? 'text-white font-semibold'
                              : isEnRoute
                                ? 'text-white font-medium animate-pulse'
                                : isReached
                                  ? 'text-white/80'
                                  : 'text-white/40'
                          }`}
                        >
                          {stop.name}
                        </span>
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
