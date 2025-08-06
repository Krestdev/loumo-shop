"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import SignUpDialog from "./RegisterDialog";
import SignInDialog from "./SignInDialog";

interface Props {
    children: React.JSX.Element;
}

export function AuthDialog({ children }: Props) {
    const t = useTranslations("HomePage")
    const [page, setPage] = useState<"login" | "register">("login");
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full" asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("noConnect")}</DialogTitle>
                </DialogHeader>
                {
                    page === "login" ?
                        <SignInDialog setOpen={setOpen} setPage={setPage} /> :
                        <SignUpDialog setOpen={setOpen} setPage={setPage} />
                }
            </DialogContent>
        </Dialog>
    );
}
