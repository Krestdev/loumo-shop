import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'
import { LucidePencil, LucideTrash } from 'lucide-react'
import { User } from '@/types/types'
import { EditUser } from './EditUser'
import { ChangePassword } from './ChangePassword'
import History from './History/HistoryTable'

const Profile = ({ user }: { user: User }) => {
    const t = useTranslations("Profile");

    const date = (user.orders && user.orders[user.orders.length - 1].createdAt)

    function formatDateToDDMMYYYY(isoString: string | number | Date) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className='flex flex-col gap-10 px-7 py-8 max-w-[1400px] w-full'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                <div className='flex flex-col gap-6 max-w-[460px] w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-4 w-full rounded-t-[12px]'>
                        <p className='text-[28px] text-white font-semibold'>{t("overview")}</p>
                    </div>
                    <div className='flex flex-col gap-5 px-6'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("loyalty")}</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{user.fidelity}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("orders")}</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{user.orders?.length}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("lastOrder")}</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{date && formatDateToDDMMYYYY(date)}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-6 max-w-[460px] w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-4 w-full rounded-t-[12px]'>
                        <p className='text-[28px] text-white font-semibold'>{t("information")}</p>
                    </div>
                    <div className='flex flex-col gap-5 px-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col gap-1'>
                                <p className='text-[14px] text-gray-500'>{t("name")}</p>
                                <p className='font-semibold text-[18px] text-gray-700'>{user?.name}</p>
                            </div>
                            <EditUser user={user}>
                                <Button variant={'outline'} className='h-9'>
                                    <LucidePencil size={16} />
                                    {t("edit")}
                                </Button>
                            </EditUser>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("email")}</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{user?.email}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("phone")}</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{user?.tel}</p>
                        </div>
                        <ChangePassword user={user}>
                            <Button className='bg-black hover:bg-black/80 h-9 w-fit'>{t("updatePassword")}</Button>
                        </ChangePassword>
                    </div>
                </div>
                <div className='flex flex-col gap-6 max-w-[460px] w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-4 w-full rounded-t-[12px]'>
                        <p className='text-[28px] text-white font-semibold'>{t("deliveryAddress")}</p>
                    </div>
                    <div className='flex flex-col gap-5 px-6 w-full'>
                        {
                            // user.addresses && user.addresses?.length > 0 ?
                            user.addresses?.map((x, i) => {
                                return (
                                    <div key={i} className='flex gap-2 w-full'>
                                        <div className='flex flex-col gap-1 w-full'>
                                            <p className='text-[14px] text-gray-500'>{t("address")}</p>
                                            <p className='text-[18px] text-gray-700 font-semibold'>{x.local}</p>
                                            <p className='text-[16px] text-gray-700'>{x.description}</p>
                                        </div>
                                        <Button variant={'ghost'} className='text-red-600 h-9 hover:bg-gray-50 hover:text-red-600'>
                                            <LucideTrash size={16} />
                                            {t("delete")}
                                        </Button>
                                    </div>
                                )
                            })
                            // : t("noAddress")
                        }
                        <Button className='bg-black hover:bg-black/80 h-9 w-fit'>{t("addAddress")}</Button>
                    </div>
                </div>
            </div>
            {user.orders && <History all={false} orders={user.orders.slice(user.orders.length - 6,user.orders.length)} />}
        </div>
    )
}

export default Profile
