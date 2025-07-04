"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Props {
    children: React.JSX.Element;
}

export function LoginDialog({ children }: Props) {
    const router = useRouter()
    const t = useTranslations("HomePage")

    return (
        <Dialog>
            <DialogTrigger className="w-full" asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("noConnect")}</DialogTitle>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button onClick={() => router.push("/auth/login")}>
                            {t("login")}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={() => router.push("/auth/register")} variant="outline">{t("register")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
