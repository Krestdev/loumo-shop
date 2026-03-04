import React from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Order } from '@/types/types';

const CancelOrder = ({ cancelOrder, setCancelOrder, action, children, order }: { cancelOrder: boolean, setCancelOrder: (v: boolean) => void, action: () => void, children: React.ReactNode, order: Order | null }) => {
    const t = useTranslations("Cart.CancelOrder")

    return (
        <Dialog open={cancelOrder} onOpenChange={setCancelOrder}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="flex flex-col items-end justify-center gap-4 py-10">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {`${t("title")} ${order?.ref}`}
                    </DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline" onClick={() => setCancelOrder(false)}>{t("close")}</Button>
                    </DialogClose>
                    <DialogClose >
                        <Button variant="destructive" onClick={() => action()}>{t("confirm")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CancelOrder
