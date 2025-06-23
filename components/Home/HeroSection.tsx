import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'

const HeroSection = () => {
    const t = useTranslations("HomePage.Hero")
    return (
        <div className='flex flex-col gap-7 px-7 pt-7 w-full items-center'>
            <div className='relative bg-gradient-to-b from-[#4CA697] to-[#BEE3A7] flex flex-row items-center rounded-[20px] px-[60px] py-20 gap-12 max-w-[1344px] w-full '>
                <div className='flex flex-col gap-5 h-fit'>
                    <h1 className='hero-text max-w-[600px]'>
                        {t("title")}
                    </h1>
                    <div className='flex gap-3 items-center'>
                        <Button variant={"primary"}>{t("allButton")}</Button>
                        <Button>{t("RegisterButton")}</Button>
                    </div>
                </div>
                <img src="/Images/hero.png" alt="Hero" className='absolute hidden sm:block sm:max-w-[200px] md:max-w-[250px] lg:max-w-[450px] xl:max-w-[530px] w-full h-auto sm:top-[50%] md:top-[40%] lg:top-5 xl:top-0 sm:right-[10px] md:right-[5px] xl:right-[79px] top-0' />
            </div>
        </div>
    )
}

export default HeroSection
