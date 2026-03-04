"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import { useState, useTransition } from "react"
import { Loader } from "lucide-react"
import Confirm from "./Confirm"

const formSchema = z
    .object({
        email: z.string().email({ message: "Email invalide" }),
    })

type FormData = z.infer<typeof formSchema>

export default function PasswordRestore() {
    const t = useTranslations("Password")
    const user = new UserQuery()
    const [isPending, startTransition] = useTransition()
    const [page, setPage] = useState<"email" | "conf">("email")
    const [email, setEmail] = useState("")

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const passwordRestore = useMutation({
        mutationKey: ["restore"],
        mutationFn: (data: { email: string }) => user.request(data),
        onError: (err) => {
            console.error("Erreur d'inscription", err)
        },
    })

    const onSubmit = (values: FormData) => {
        const emailLower = values.email.toLowerCase();
        setEmail(values.email);

        startTransition(() => {
            passwordRestore.mutate({ email: emailLower });
            setPage("conf");
        });
    };


    return (
        page === "email" ?
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-10"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-center">{t("resetPassword")}</h1>
                        <p className="text-[14px] text-gray-700 text-center">{t("description")}</p>
                    </div>

                    <div className="max-w-[360px] w-full flex flex-col gap-6">

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("email")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ex: exemple@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={isPending || passwordRestore.isPending} type="submit" className="w-full">
                            {isPending || passwordRestore.isPending && <Loader className='animate-spin mr-2' size={16} />}
                            {t("check")}
                        </Button>
                    </div>
                </form>
            </Form> :
            <Confirm email={email} />
    )
}
