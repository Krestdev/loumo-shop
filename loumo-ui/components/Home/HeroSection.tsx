import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'
import { useStore } from '@/providers/datastore'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const t = useTranslations("HomePage.Hero");
    const { user } = useStore();
    const router  = useRouter();

    return (
        <div className='flex flex-col gap-7 px-7 md:pt-7 w-full items-center'>
            <div className='relative bg-gradient-to-b from-[#4CA697] to-[#BEE3A7] flex flex-row items-center sm:rounded-[20px] px-[60px] py-20 gap-12 max-w-[1344px] w-screen sm:w-full '>
                <div className='absolute flex sm:hidden top-0 left-0 z-10 bg-gradient-to-b from-[#4CA697]/70 to-[#BEE3A7] w-full h-full' />
                <div className='flex flex-col gap-5 h-fit z-20'>
                    <h1 className='hero-text text-center sm:text-left max-w-[600px]'>
                        {t("title")}
                    </h1>
                    <div className='flex flex-col sm:flex-row gap-3 items-center'>
                        <Button onClick={() => router.push("/catalog")} variant={"default"}>{t("allButton")}</Button>
                        {!user && <Button variant={"secondary"} className='bg-black hover:bg-black/80'>{t("RegisterButton")}</Button>}
                    </div>
                </div>
                <img src="/Images/hero.png" alt="Hero" className='absolute max-w-[396px] mx-auto sm:max-w-[200px] md:max-w-[250px] lg:max-w-[450px] xl:max-w-[530px] w-full h-auto top-0 sm:top-[50%] md:top-[40%] lg:top-5 xl:top-0 right-[20px] z-0 sm:right-[10px] md:right-[5px] xl:right-[79px]' />
            </div>
        </div>
    )
}

export default HeroSection
