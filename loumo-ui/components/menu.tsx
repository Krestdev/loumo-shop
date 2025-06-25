"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle
} from "@/components/ui/drawer"
import { useStore } from "@/providers/datastore"
import { LucideMapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import LocaleSwitcher from "./localSwitcher"
import CategoryQuery from "@/queries/category"
import { useQuery } from "@tanstack/react-query"
import Loading from "./setup/loading"

interface Props {
    children: React.JSX.Element
}


export function Menu({ children }: Props) {

    const t = useTranslations("Header")
    const { user } = useStore()
    const [isClient, setIsClient] = React.useState(false)

    React.useEffect(() => {
        setIsClient(true)
    }, [])

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


    return (
        <Drawer direction="left">
            <DrawerTrigger asChild className="flex md:hidden">
                {children}
            </DrawerTrigger>
            <DrawerContent className="flex md:hidden max-w-[260px] w-full overflow-y-auto">
                <div className="w-full">
                    {
                        !user &&
                        <DrawerTitle className="flex flex-col gap-2 px-6 py-5 sticky">
                            <Button>{t("login")}</Button>
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 h-[1px] w-full" />
                                <p className="text-[10px] text-[#E4E4E7] font-medium">{t("or")}</p>
                                <div className="bg-gray-200 h-[1px] w-full" />
                            </div>
                            <Button className="bg-black hover:bg-black/80">{t("register")}</Button>
                        </DrawerTitle>
                    }
                </div>
                <div className="flex flex-col gap-2 px-6 py-3 sticky">
                    {/* Adresse */}
                    {isClient && (user?.addresses?.length ?? 0) > 0 && (
                        <div className='flex justify-center items-center gap-2 max-w-[160px] w-full'>
                            <LucideMapPin size={20} className='flex-shrink-0' />
                            <div className='flex flex-col w-full overflow-hidden'>
                                <p className='text-xs text-muted-foreground'>{t("address")}</p>
                                <p className='text-sm truncate'>
                                    {user?.addresses?.[0]?.street}
                                </p>
                            </div>
                        </div>
                    )}
                    <LocaleSwitcher />
                </div>
                <div className="flex flex-col">
                    {
                        categoryData.data?.filter(a => (a.products?.length ?? 0) > 0 ).map((x,i) => {
                            return(
                                <div key={i} className="flex flex-col py-5 border-t border-input">
                                    <div className="flex gap-2 px-6 py-4">
                                        <p className="font-bold text-[18px] text-gray-900">{x.name}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        {
                                            x.products?.map((a,j) => {
                                                return(
                                                    <div key={j} className="flex gap-2 px-6 py-3">
                                                        <p className="text-gray-900 text-[16px]">{a.name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </DrawerContent>
        </Drawer>
    )
}
