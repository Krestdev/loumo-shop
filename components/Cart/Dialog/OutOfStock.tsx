"use client";

import { Button } from "@/components/ui/button";
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
import { LucideX } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    children: React.ReactNode
}
export default function OutOfStock({ children }: Props) {
    const t = useTranslations("Cart.OutOfStock")
    return (
        <Dialog>
            <DialogTrigger className="w-full">{children}</DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center gap-4 py-10">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>
                <LucideX className="h-20 text-red-500 w-20" />
                <DialogFooter>
                    <DialogClose>
                        <Button type="button">
                            {t("goBack")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
