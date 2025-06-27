import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

interface Props {
    children: React.JSX.Element
}

export function Awaiting({ children }: Props) {
    const t = useTranslations("Cart.Awaiting")
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>
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
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">{t("close")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
