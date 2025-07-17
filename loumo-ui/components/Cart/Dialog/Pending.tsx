"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Pending({ open, setOpen }: Props) {
    const t = useTranslations("Cart.Awaiting")
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col items-center justify-center gap-4 py-10">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <Loader2 className="h-20 w-20 animate-spin text-primary" />
                <div className="flex flex-col px-3 gap-3">
                    <p className="text-[14px] text-gray-900 font-normal">{t("action")}</p>
                    <div className="flex flex-col gap-2 pl-1">
                        <p className="text-[14px] text-gray-900 font-normal">{`1. ${t("step1")}`}</p>
                        <p className="text-[14px] text-gray-900 font-normal">{`2. ${t("step2")}`}</p>
                    </div>
                    <div className="flex flex-col gap-5">
                        <p className="text-[14px] text-gray-900 font-normal">{t("conclusion")}</p>
                        <p className="text-[14px] text-gray-900 font-normal">{t("thank")}</p>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
