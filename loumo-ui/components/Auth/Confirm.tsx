import { useTranslations } from 'next-intl'
import React from 'react'

const Confirm = ({ email }: { email: string }) => {
    const t = useTranslations("Password")
    return (
        <div className='max-w-[520px] w-full py-24 mx-auto'>
            <div className="flex flex-col items-center gap-2">
                <img src="/Images/success.png" alt="success" className='max-w-[80px] w-full h-auto aspect-square' />
                <h1 className="text-center">{t("confTitle")}</h1>
                <p className="text-[18px] text-gray-700 text-center">{`${t("confirmed")} ${email}, ${t("instruction")}`}</p>
            </div>
        </div>
    )
}

export default Confirm
