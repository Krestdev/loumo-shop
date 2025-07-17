"use client"

import { useStore } from '@/providers/datastore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

const Notification = () => {
  const t = useTranslations("HomePage.Hero")
  const { user } = useStore()

  const showNotification = !user || (user?.orders?.length === 0)

  if (!showNotification) return null

  return (
    <Link href={!user ? "/auth/login" : "/catalog"} className='w-full bg-primary flex justify-center px-7 py-2 gap-2'>
      <p className='text-white text-[12px]'>{t("notification")}</p>
    </Link>
  )
}

export default Notification
