'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { useState, useEffect } from 'react';

export default function About() {
  const t = useTranslations('about');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const carouselImages = [
    '/images/client-kelingking.png',
    '/images/client-lempuyang.png',
    '/images/client-ulundanu.png',
    '/images/client-uluwatu.png',
    '/images/client-tegalalang.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const stats = [
    { value: t('statYearsValue'), label: t('statYears') },
    { value: t('statCustomersValue'), label: t('statCustomers') },
    { value: t('statPackagesValue'), label: t('statPackages') },
  ];

  return (
    <section id='about' className='py-24 bg-dark-900 relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #D4A843 0%, transparent 50%)',
        }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          <div>
            <p className='text-gold-400 font-medium tracking-widest uppercase text-sm mb-3'>
              {t('badge')}
            </p>
            <h2 className='font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold mb-6'>
              {t.rich('heading', {
                bali: (chunks) => (
                  <span className='text-gold-400'>{chunks}</span>
                ),
              })}
            </h2>
            <p className='text-white/60 leading-relaxed mb-4'>
              {t('paragraph1')}
            </p>
            <p className='text-white/60 leading-relaxed mb-8'>
              {t.rich('paragraph2', {
                brand: (chunks) => (
                  <strong className='text-gold-400'>{chunks}</strong>
                ),
              })}
            </p>
            <div className='grid grid-cols-3 gap-4 sm:gap-6'>
              {stats.map((s) => (
                <div key={s.label} className='text-center p-4 rounded-xl glass'>
                  <p className='font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-gold-400'>
                    {s.value}
                  </p>
                  <p className='text-xs text-white/50 mt-1'>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl img-hover group'>
            {carouselImages.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`Teman Travel Travelers in Bali - Photo ${idx + 1}`}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  idx === currentImageIdx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className='absolute bottom-4 right-4 bg-dark-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 z-10'>
              <p className='text-white/90 text-xs font-medium tracking-wide'>
                ✦ Teman Travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
