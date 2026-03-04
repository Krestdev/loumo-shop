import Redaction from '@/components/redaction'
import { useTranslations } from 'next-intl'
import React from 'react'

const Maintenance = () => {
    const t = useTranslations('Maintenance')
    return (
        <div>
            <Redaction message={t("maintenance")} />
        </div>
    )
}

export default Maintenance
