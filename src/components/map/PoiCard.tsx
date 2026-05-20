import { FiCoffee, FiCamera, FiActivity, FiExternalLink, FiStar } from 'react-icons/fi';

interface PoiProps {
  name: string;
  nameEn?: string;
  nameId?: string;
  subtitleEn?: string;
  subtitleId?: string;
  category: string;
  rating: number;
  distance: string;
  googleMapsUrl: string;
}

interface PoiCardProps {
  poi: PoiProps;
  dayColor: string;
  tCategory: string;
  tMapsLink: string;
  className?: string;
  onClick?: () => void;
  locale?: string;
}

export default function PoiCard({
  poi,
  dayColor,
  tCategory,
  tMapsLink,
  className = '',
  onClick,
  locale = 'en',
}: PoiCardProps) {
  const displayName = locale === 'id' ? (poi.nameId || poi.name) : (poi.nameEn || poi.name);
  const displaySubtitle = locale === 'id' ? (poi.subtitleId || poi.subtitleEn) : (poi.subtitleEn || poi.subtitleId);

  const getCategoryIcon = (category: string, color: string) => {
    switch (category) {
      case 'food':
      case 'cafe':
        return <FiCoffee className='w-3 h-3 shrink-0' style={{ color }} />;
      case 'photo':
        return <FiCamera className='w-3 h-3 shrink-0' style={{ color }} />;
      default:
        return <FiActivity className='w-3 h-3 shrink-0' style={{ color }} />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-black/30 border border-white/5 rounded-lg p-2.5 space-y-2 transition-all hover:bg-black/45 select-none ${className}`}
    >
      {/* Title & Distance Row */}
      <div className='flex items-start justify-between gap-2'>
        <div className='min-w-0'>
          <span className='font-bold text-xs text-white leading-tight line-clamp-1 block'>
            {displayName}
          </span>
          {displaySubtitle && (
            <span className='block text-[10px] text-white/50 leading-tight mt-0.5 line-clamp-1'>
              {displaySubtitle}
            </span>
          )}
        </div>
        <span className='shrink-0 text-[10px] text-white/40 font-mono mt-0.5'>
          {poi.distance}
        </span>
      </div>

      {/* Meta Actions Row */}
      <div className='flex items-center justify-between gap-2 pt-1'>
        <div className='flex items-center gap-2'>
          {/* Category Badge */}
          <span className='inline-flex items-center gap-1 px-1.5 rounded bg-white/10 text-white/70 text-[9px] font-medium border border-white/5 h-[18px] leading-none shrink-0'>
            {getCategoryIcon(poi.category, dayColor)}
            <span>{tCategory}</span>
          </span>
          
          {/* Rating Badge - Balanced Star Rating */}
          <span className='inline-flex items-center gap-0.5 font-bold text-[10px] h-[18px] leading-none shrink-0' style={{ color: dayColor }}>
            <FiStar className='w-2.5 h-2.5 shrink-0 fill-current' style={{ color: dayColor }} />
            <span className='leading-none font-mono mt-0.5'>{poi.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Directions Link */}
        <a
          href={poi.googleMapsUrl}
          target='_blank'
          rel='noopener noreferrer'
          onClick={(e) => e.stopPropagation()}
          className='inline-flex items-center gap-1 text-[9px] font-bold transition-colors uppercase tracking-wider hover:brightness-110 shrink-0 h-[18px] leading-none'
          style={{ color: dayColor }}
        >
          <span>{tMapsLink}</span>
          <FiExternalLink className='w-3 h-3 shrink-0' style={{ color: dayColor }} />
        </a>
      </div>
    </div>
  );
}
