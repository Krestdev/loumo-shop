"use client"

import { useStep } from '@/data/data'
import { useTranslations } from 'next-intl';
import React from 'react'

const HowStep = () => {
    const step = useStep();
    const t = useTranslations("HomePage.Step");
  return (
    <div className='flex flex-col gap-7 px-7 py-10 lg:py-24 max-w-[1400px] w-full'>
      <h1 className='category-title'>{t("title")}</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
        {
            step.map((x,i) => (
                <div key={i} className='flex flex-col gap-5 px-7 py-8 rounded-[20px] border border-input max-w-[340px] w-full'>
                    <img src={x.image} alt={x.title} className='max-w-[284px] aspect-auto rounded-[12px]' />
                    <div className='bg-secondary h-8 px-3 py-2 rounded-[20px] flex items-center justify-center w-fit'>
                        <p className='text-white uppercase'>{x.step + " " + i}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-[20px] text-gray-900 font-semibold'>{x.title}</p>
                        <p className='text-gray-700 text-[16px]'>{x.descrip}</p>
                    </div>
                </div>
            ))
        }
      </div>
    </div>
  )
}

export default HowStep
