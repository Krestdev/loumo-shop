'use client'

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import React from 'react';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import Image from 'next/image';

interface Props {
  defaultValue: string;
  children: React.ReactNode;
}

function LocaleSelect({ defaultValue, children }: Props) {
  const [isPending, startTransition] = React.useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className='flex items-center w-[90px] sm:w-[50px] !gap-0 uppercase bg-transparent text-black border-none shadow-none h-4 text-[14px] font-medium cursor-pointer'>
        <Image
          src={`/flags/${defaultValue}.svg`}
          width={20}
          height={40}
          className='object-cover h-[16px] w-[21px]'
          alt='flag'
        />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className='w-5'>
        {children}
      </SelectContent>
    </Select>
  )
}

export default LocaleSelect;
