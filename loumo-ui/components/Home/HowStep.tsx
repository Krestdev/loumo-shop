"use client"

import { useStep } from '@/data/data'
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'

const HowStep = () => {
  const step = useStep();
  const t = useTranslations("HomePage.Step");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Configuration du carousel automatique
  useEffect(() => {
    if (step.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === step.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [step.length]);

  // Navigation manuelle
  const goToNext = () => {
    setCurrentIndex(currentIndex === step.length - 1 ? 0 : currentIndex + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? step.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Gestion du swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;

    if (distance > 50) {
      // swipe gauche → slide suivant
      goToNext();
    }

    if (distance < -50) {
      // swipe droite → slide précédent
      goToPrevious();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className='flex flex-col gap-7 px-7 py-10 lg:py-24 max-w-[1400px] w-full'>
      <h1 className='category-title'>{t("title")}</h1>

      {/* Version desktop */}
      <div className='hidden md:grid grid-cols-1 md:grid-cols-3 gap-10'>
        {step.map((x, i) => (
          <div key={i} className='flex flex-col gap-5 px-7 py-8 rounded-[20px] border border-input max-w-[340px] w-full'>
            <img src={x.image} alt={x.title} className='max-w-[284px] aspect-auto rounded-[12px]' />
            <div className='bg-secondary h-8 px-3 py-2 rounded-[20px] flex items-center justify-center w-fit'>
              <p className='text-white uppercase'>{x.step + " " + (i + 1)}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-[20px] text-gray-900 font-semibold'>{x.title}</p>
              <p className='text-gray-700 text-[16px]'>{x.descrip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Version mobile (carousel) */}
      <div
        className='relative md:hidden'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className='overflow-hidden'>
          <div
            className='flex transition-transform ease-out duration-500'
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {step.map((x, i) => (
              <div key={i} className='flex-shrink-0 w-full px-2'>
                <div className='flex flex-col gap-3 px-7 py-5 rounded-[20px] border border-input max-w-[340px] mx-auto w-full'>
                  <img src={x.image} alt={x.title} className='max-w-[284px] aspect-[5/3] rounded-[12px] mx-auto' />
                  <div className='bg-secondary h-8 px-3 py-2 rounded-[20px] flex items-center justify-center w-fit mx-auto'>
                    <p className='text-white uppercase text-[16px]'>{x.step + " " + (i + 1)}</p>
                  </div>
                  <div className='flex flex-col gap-2 text-center'>
                    <p className='text-[16px] text-gray-900 font-semibold'>{x.title}</p>
                    <p className='text-gray-700 text-[14px]'>{x.descrip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicateurs de navigation */}
        {step.length > 1 && (
          <div className='flex justify-center mt-4'>
            {step.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-3 w-3 rounded-full mx-1 ${i === currentIndex ? 'bg-secondary' : 'bg-gray-300'}`}
                aria-label={`Aller à l'étape ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HowStep
