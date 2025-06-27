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
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader } from "lucide-react"

const formSchema = z
    .object({
        email: z.string().email({ message: "Email invalide" }),
    })

type FormData = z.infer<typeof formSchema>

export default function PasswordRestore() {
    const t = useTranslations("Password")
    const router = useRouter()
    const user = new UserQuery()
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const userRegister = useMutation({
        mutationKey: ["register"],
        mutationFn: (data: any) => user.register(data),
        onSuccess: () => {
            router.push("/auth/login")
        },
        onError: (err) => {
            console.error("Erreur d'inscription", err)
        },
    })

    const onSubmit = (values: FormData) => {
        startTransition(() => {
            userRegister.mutate({
                email: values.email.toLowerCase(),
            })
        })
    }

    return (
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

                    <Button disabled={isPending || userRegister.isPending} type="submit" className="w-full">
                        {isPending || userRegister.isPending && <Loader className='animate-spin mr-2' size={16} />}
                        {t("check")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
