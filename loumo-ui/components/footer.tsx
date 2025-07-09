"use client"

import CategoryQuery from '@/queries/category';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import Loading from './setup/loading';

const Footer = () => {
    const t = useTranslations("Footer")
    const category = new CategoryQuery();
    const categoryData = useQuery({
        queryKey: ["categoryFetchAll"],
        queryFn: () => category.getAll(),
    });

    if (categoryData.isLoading) {
        return <Loading status={"loading"} />;
    }

    if (categoryData.isError) {
        return <Loading status={"failed"} />;
    }
    const info = [
        {
            title: t("Info.fast"),
            description: t("Info.fastDesc"),
            icon: "/Images/footer/delivery.svg"
        },
        {
            title: t("Info.mobile"),
            description: t("Info.mobileDesc"),
            icon: "/Images/footer/wallet.svg"
        },
        {
            title: t("Info.support"),
            description: t("Info.supportDesc"),
            icon: "/Images/footer/support.svg"
        },

    ]
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
        <div className='w-full flex justify-center bg-secondary'>
            <div className='flex flex-col max-w-[1400px] w-full'>
                <div className='flex flex-col gap-10 px-7 py-10'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10'>
                        {
                            info.map((x, i) => {
                                return (
                                    <div key={i} className='flex flex-row items-center px-5 py-4 gap-4'>
                                        <img src={x.icon} alt={x.title} className='h-12 w-12 md:h-16 md:w-16' />
                                        <div className='flex flex-col gap-1'>
                                            <p className='text-[24px] text-gray-50 font-semibold'>{x.title}</p>
                                            <p className='text-[14px] text-gray-200 font-normal'>{x.description}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-7 gap-7 md:px-0 md:gap-10'>
                        <div className='flex flex-col gap-5'>
                            <p className='text-[16px] text-gray-50 font-semibold'>{t("Help.help")}</p>
                            <div className='flex flex-col gap-3'>
                                <Link href={"/faq"} className='text-[14px] font-medium text-gray-50' >{t("Help.faq")}</Link>
                                <Link href={""} className='text-[14px] font-medium text-gray-50' >{t("Help.fees")}</Link>
                                <Link href={"/condition"} className='text-[14px] font-medium text-gray-50' >{t("Help.policy")}</Link>
                                <Link href={"/contact"} className='text-[14px] font-medium text-gray-50' >{t("Help.contact")}</Link>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <p className='text-[16px] text-gray-50 font-semibold'>{t("category")}</p>
                            <div className='flex flex-col gap-3'>
                                {
                                    categoryData.data?.slice(0, 6).map((x, i) => {
                                        return (
                                            <Link key={i} href={`/categories/${x.slug}`} className='text-[14px] font-medium text-gray-50' >{x.name}</Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <p className='text-[16px] text-gray-50 font-semibold'>{t("About.about")}</p>
                            <div className='flex flex-col gap-3'>
                                <Link href={"/condition"} className='text-[14px] font-medium text-gray-50' >{t("About.term")}</Link>
                                <Link href={"/condition"} className='text-[14px] font-medium text-gray-50' >{t("About.privacy")}</Link>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <p className='text-[16px] text-gray-50 font-semibold'>{t("followUs")}</p>
                            <div className='flex flex-row items-center gap-3'>
                                {
                                    social.map((x, i) => {
                                        return (
                                            <Link key={i} href={x.link} className='text-[14px] font-medium text-gray-50' >
                                                <img src={x.icon} alt={x.title} className='h-5 w-5' />
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border-t border-[#E5E5E5]/20 flex items-center justify-center gap-2 py-5'>
                    <p className='text-[14px] text-white'>{t("copyright")}</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
