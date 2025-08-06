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
import { useEffect, useState, useTransition } from "react"
import UserQuery from "@/queries/user"
import { useMutation } from "@tanstack/react-query"
import { useStore } from "@/providers/datastore"
import Link from "next/link"
import { Loader } from "lucide-react"
import GoogleLogin from "./GoogleLogin"

const phoneSchema = z.object({
    phone: z.string().min(9, "Numéro invalide"),
    password: z.string().min(6, { message: "Mot de passe trop court" }),
})

const emailSchema = z.object({
    email: z.string().email({ message: "Email invalide" }),
    password: z.string().min(6, { message: "Mot de passe trop court" }),
})

const loginSchema = z.union([phoneSchema, emailSchema])

type LoginFormData = z.infer<typeof loginSchema>

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setPage: React.Dispatch<React.SetStateAction<"login" | "register">>
}

export default function SignInDialog({ setOpen, setPage }: Props) {
    const t = useTranslations("Login")
    const [method, setMethod] = useState<"phone" | "email">("email")
    const [isPending, startTransition] = useTransition()
    const { setUser } = useStore()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            phone: "",
            email: "",
            password: "",
        },
    })

    const user = new UserQuery()

    const userData = useMutation({
        mutationKey: ["login"],
        mutationFn: (data: { email: string; password: string }) => user.login(data),
        onSuccess: () => {
            setOpen(false)
        },
        onError: (error) => {
            console.error("Échec de connexion :", error)
        },
    })

    useEffect(() => {
        if (userData.isSuccess) {
            setUser(userData.data.user)
            localStorage.setItem("token", userData.data?.token)
        }
    }, [userData.data, setUser, userData.isSuccess])

    const onSubmit = (values: LoginFormData) => {
        startTransition(() => {
            if ("email" in values) {
                userData.mutate({
                    email: values.email.toLowerCase(),
                    password: values.password,
                })
            } else if ("phone" in values) {
                // méthode téléphone pas encore activée
                setMethod("email")
            }
        })
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                <p className="text-sm text-center text-gray-700">{t("description")}</p>

                <div className="flex flex-col items-center gap-5">


                    <GoogleLogin />

                    <p className="text-[14px] text-gray-700 text-center">{t("or")}</p>

                    <div className="space-y-4">
                        {method === "phone" ? (
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("phone")}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="tel"
                                                    placeholder="ex: 677 77 88 88"
                                                    {...field}
                                                    className="pl-14"
                                                />
                                                <div className="absolute top-0 left-0 h-9 flex items-center px-2 bg-accent/20 rounded-l-md">
                                                    <span className="text-gray-900">+237</span>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("email")}</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="ex: exemple@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("password")}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="button"
                            className="w-full"
                            disabled={userData.isPending || isPending}
                            onClick={() => form.handleSubmit(onSubmit)()}
                        >
                            {(userData.isPending || isPending) && (
                                <Loader className="mr-2 animate-spin" size={16} />
                            )}
                            {t("login")}
                        </Button>


                        <div className="flex items-center justify-between text-sm">
                            <Link href="/auth/restore-password" className="text-primary underline">
                                {t("forgot")}
                            </Link>
                            <div className="flex items-center gap-1">
                                <span>{t("notYet")}</span>
                                <Button type="button" variant="link" onClick={() => setPage("register")} className="text-primary underline py-0">
                                    {t("signIn")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
