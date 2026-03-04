"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function OrderPending({ open, setOpen }: Props) {
    const t = useTranslations("Cart.Awaiting")
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col items-center justify-center gap-4 py-10">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        {t("title1")}
                    </DialogTitle>
                </DialogHeader>

                <Loader2 className="h-20 w-20 animate-spin text-primary" />
            </DialogContent>
        </Dialog>
    );
}
