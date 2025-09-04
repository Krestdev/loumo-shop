import { useTranslations } from 'next-intl'
import React from 'react'
import { Button } from '../ui/button'
import { LucidePencil } from 'lucide-react'
import { Order, User } from '@/types/types'
import { EditUser } from './EditUser'
import { ChangePassword } from './ChangePassword'
import History from './History/HistoryTable'

const Profile = ({ users, orders }: { users: User, orders: Order[] }) => {

    const t = useTranslations("Profile");
    const date = (orders.length > 0 ? orders[orders.length - 1].createdAt : null);

    function formatDateToDDMMYYYY(isoString: string | number | Date) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className='flex flex-col gap-10 px-7 py-8 max-w-[1400px] w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col gap-6 w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-2 md:py-4 w-full rounded-t-[12px]'>
                        <p className='text-[18px] md:text-[28px] text-white font-semibold'>{t("overview")}</p>
                    </div>
                    <div className='flex flex-col md: gap-5 px-6 w-full'>
                        <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                            <div className='flex flex-col'>
                                <p className='text-[14px] text-gray-500'>{t("loyalty")}</p>
                                <p className='font-semibold text-[18px] text-gray-700'>{users.fidelity}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-[14px] text-gray-500'>{t("orders")}</p>
                                <p className='font-semibold text-[18px] text-gray-700'>{users.orders?.length}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-[14px] text-gray-500'>{t("lastOrder")}</p>
                                <p className='font-semibold text-[18px] text-gray-700'>{date ? formatDateToDDMMYYYY(date) : "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-6 w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-2 md:py-4 w-full rounded-t-[12px]'>
                        <p className='text-[18px] md:text-[28px] text-white font-semibold'>{t("information")}</p>
                    </div>
                    <div className='flex flex-col gap-1 px-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-row items-center gap-1'>
                                <p className='text-[14px] text-gray-500'>{t("name")} :</p>
                                <p className='font-semibold text-[18px] text-gray-700'>{users?.name}</p>
                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("email")} :</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{users?.email}</p>
                        </div>
                        <div className='flex flex-row items-center gap-1'>
                            <p className='text-[14px] text-gray-500'>{t("phone")} :</p>
                            <p className='font-semibold text-[18px] text-gray-700'>{users?.tel}</p>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-2 md:mx-auto'>
                            <ChangePassword user={users}>
                                <Button className='bg-black hover:bg-black/80 h-9 w-fit'>{t("updatePassword")}</Button>
                            </ChangePassword>
                            <EditUser user={users}>
                                <Button variant={'outline'} className='h-9'>
                                    <LucidePencil size={16} />
                                    {t("edit")}
                                </Button>
                            </EditUser>
                        </div>
                    </div>
                </div>
                {/* <div className='flex flex-col gap-6 w-full  rounded-[12px] border border-input pb-8'>
                    <div className='bg-primary/80 px-6 py-2 md:py-4 w-full rounded-t-[12px]'>
                        <p className='text-[18px] md:text-[28px] text-white font-semibold'>{t("deliveryAddress")}</p>
                    </div>
                    <div className='flex flex-col gap-5 px-6 w-full'>
                        {
                            // user.addresses && user.addresses?.length > 0 ?
                            users.addresses?.map((x, i) => {
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
                </div> */}
            </div>
            {orders && <History all={false} orders={orders.filter(x => x.userId === users.id).slice(0, 5)} />}
        </div>
    )
}

export default Profile
