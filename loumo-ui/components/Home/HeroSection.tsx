import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'
import { useStore } from '@/providers/datastore'
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const t = useTranslations("HomePage.Hero");
    const { user } = useStore();
    const router = useRouter();

    return (
        <div className='flex flex-col gap-7 px-7 md:pt-7 w-full items-center'>
            <div className='relative bg-gradient-to-b from-[#4CA697] to-[#BEE3A7] flex flex-col justify-center items-start sm:rounded-[20px] px-12 py-15 pb-25 max-w-[1344px] w-screen sm:w-full '>
                <div className='absolute flex rounded-[20px] top-0 left-0 z-10 bg-gradient-to-b from-[#4CA697]/80 to-[#BEE3A7] w-full h-full' />
                <div className='flex flex-col items-center mx-auto md:mx-0 gap-5 h-[100px] md:h-full z-10'>
                    <h1 className='hero-text font-normal text-center md:text-start max-w-[800px] sm:max-w-[400px] md:max-w-[545px] xl:max-w-[570px] text-[30px] md:text-[50px] lg:text-[60px] xl:text-[70px]'>
                        {t("title")}
                    </h1>
                    <div className='flex flex-row sm:flex-row gap-3 items-center md:items-start w-fit md:w-full'>
                        <Button onClick={() => router.push("/catalog")} variant={"default"}>{t("allButton")}</Button>
                        {!user && <Button onClick={() => router.push("/auth/register")} variant={"secondary"} className='bg-black hover:bg-black/80'>{t("RegisterButton")}</Button>}
                    </div>
                </div>
                <img src="/Images/hero.png" alt="Hero" className='absolute max-w-[320px] mx-auto md:mx-0 sm:max-w-[200px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[530px] w-full h-auto top-0 left-0 md:left-[50%] sm:top-[40%] md:top-[20%] lg:top-5 xl:top-0 xl:h-full right-[20px] z-0 sm:right-[10px] xl:right-[79px] md:z-10' />
            </div>
        </div>
    )
}

export default HeroSection
