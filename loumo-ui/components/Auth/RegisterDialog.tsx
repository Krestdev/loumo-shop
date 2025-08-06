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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import React, { useTransition } from "react"
import { RegisterPayload } from "@/types/types"
import GoogleLogin from "./GoogleLogin"

const formSchema = z
    .object({
        name: z.string().min(2, "Nom requis"),
        email: z.string().email({ message: "Email invalide" }),
        phone: z.string().min(9, "Numéro invalide"),
        password: z.string().min(6, { message: "Mot de passe trop court" }),
        cfPassword: z.string().min(6, { message: "Confirmation requise" }),
        condition: z.boolean().refine(val => val === true, {
            message: "Vous devez accepter les conditions",
        }),
    })
    .refine((data) => data.password === data.cfPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["cfPassword"],
    })

type FormData = z.infer<typeof formSchema>

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setPage: React.Dispatch<React.SetStateAction<"login" | "register">>
}

export default function SignUpDialog({ setOpen, setPage }: Props) {
    const t = useTranslations("SignUp")
    const user = new UserQuery()
    const [isPending, startTransition] = useTransition()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            cfPassword: "",
            condition: false,
        },
    })

    const userRegister = useMutation({
        mutationKey: ["register"],
        mutationFn: (data: RegisterPayload) => user.register(data),
        onSuccess: () => {
            setOpen(false)
        },
        onError: (err) => {
            console.error("Erreur d'inscription", err)
        },
    })

    const onSubmit = (values: FormData) => {
        startTransition(() => {
            userRegister.mutate({
                name: values.name,
                email: values.email.toLowerCase(),
                tel: values.phone,
                password: values.password,
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <p className="text-sm text-center text-gray-700">{t("description")}</p>

                <div className="flex flex-col items-center gap-5">


                    <GoogleLogin />
                    <p className="text-[14px] text-gray-700 text-center">{t("or")}</p>
                    
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Votre nom complet" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("phone")}</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="ex: 677778888" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="cfPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("cfPassword")}</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem className="flex items-start gap-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="text-sm leading-none">
                                        <FormLabel>{t("accept")}</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="button"
                            className="w-full"
                            disabled={isPending || userRegister.isPending}
                            onClick={() => form.handleSubmit(onSubmit)()}
                        >
                            {(isPending || userRegister.isPending) && (
                                <Loader className="animate-spin mr-2" size={16} />
                            )}
                            {t("signUp")}
                        </Button>


                        <div className="flex items-center gap-1">
                            <span>{t("alreaddy")}</span>
                            <Button type="button" variant="link" onClick={() => setPage("login")} className="text-primary underline py-0">
                                {t("login")}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
