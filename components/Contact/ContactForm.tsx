import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link';

const ContactForm = () => {
    const t = useTranslations("Contact");
    const social = [
        {
            title: "facebook",
            icon: "/Images/social/facebook.svg",
            link: "#"
        },
        {
            title: "X",
            icon: "/Images/social/x.svg",
            link: "#"
        },
        {
            title: "telegram",
            icon: "/Images/social/telegram.svg",
            link: "#"
        },
        {
            title: "tiktok",
            icon: "/Images/social/tiktok.svg",
            link: "#"
        },
    ]

    return (
        <div className="flex flex-col items-center gap-10 px-7 py-8 max-w-[1400px] w-full mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-center">{t("title")}</h1>
                <p className="max-w-[640px] w-full text-[14px] text-gray-700 text-center">
                    {t("description")}
                </p>
            </div>
            <div className='flex flex-row gap-10 w-full'>
                <div className='flex flex-col gap-8 max-w-[652px] w-full'>
                    <div className='flex flex-col gap-4 max-w-[640px]'>
                        <p className='text-[36px] text-primary font-semibold'>{t("contactUs")}</p>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <p className='text-[14px] text-gray-500'>{t("email")}</p>
                                <Link href={"mailto: contact@loumo.shop"} className='text-gray-900 text-[18px] font-semibold'>{"contact@loumo.shop"}</Link>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p className='text-[14px] text-gray-500'>{t("phone")}</p>
                                <Link href={"tel: +237 6 77 88 88 88"} className='text-gray-900 text-[18px] font-semibold'>{"+237 6 77 88 88 88"}</Link>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <p className='text-[14px] text-gray-500'>{t("office")}</p>
                                <p className='text-gray-900 text-[18px] font-semibold'>{"Mboppi Douala Cameroun"}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 max-w-[640px]'>
                        <p className='text-[36px] text-primary font-semibold'>{t("hours")}</p>
                        <div className='flex flex-col gap-4'>
                            <li>{"Du lundi au vendredi : 8h00 – 18h00"}</li>
                            <li>{"Samedi : 9h00 – 15h00"}</li>
                            <li>{"Dimanche : Fermé"}</li>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4 max-w-[640px]'>
                        <p className='text-[36px] text-primary font-semibold'>{t("followUs")}</p>
                        <div className='flex items-center gap-2'>
                            {
                                social.map((x, i) => (
                                    <Button key={i} variant={"outline"} className='h-16 w-16'>
                                        <img src={x.icon} alt={x.title} className='h-10 w-10' />
                                    </Button>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='max-w-[652px] w-full mx-auto'>
                    <img
                        src="/Images/contact.png"
                        alt="Contact"
                        className='w-full aspect-[4/3] object-cover'
                    />
                </div>
            </div>
        </div>
    )
}

export default ContactForm
