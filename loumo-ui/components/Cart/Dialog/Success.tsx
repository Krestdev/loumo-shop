import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function Success({ open, setOpen }: Props) {
    const t = useTranslations("Cart.Success")
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <img src="/Images/success.png" alt="Success" className="max-w-[200px] w-full h-auto aspect-auto" />
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
