"use client"

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User } from "@/types/types"
import { useState } from "react"
import { AddAddress } from "../select-address"
import { LoginDialog } from "../Auth/loginDialog"


const formSchema = z.object({
    tel: z.string().min(8, { message: "Numéro trop court" }).max(15, { message: "Numéro trop long" }),
    paymentMethod: z.enum(["cash", "orange", "mtn"], { required_error: "Mode de paiement requis" }),
    paymentNumber: z.string().optional(),
}).superRefine((data, ctx) => {
    if (["orange", "mtn"].includes(data.paymentMethod)) {
        if (!data.paymentNumber || data.paymentNumber.length < 8) {
            ctx.addIssue({
                code: "custom",
                path: ["paymentNumber"],
                message: "Numéro requis pour ce mode de paiement",
            });
        }
    }
});

type FormValues = z.infer<typeof formSchema>

const DeliveryPaymentForm = ({ user, onValidate, totalPrice }: { user: User | null; onValidate: () => void; totalPrice: number }) => {
    const t = useTranslations("Cart")
    const [level, setLevel] = useState<"summary" | "paiement">("summary")

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tel: user?.tel?.toString() || "",
            paymentMethod: "cash",
            paymentNumber: "",
        },
    })

    const paymentMethod = form.watch("paymentMethod")

    const onSubmit = (values: FormValues) => {
        console.log("Form submitted:", values)
        onValidate()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-[515px] w-full gap-7">
                {/* LIVRAISON */}
                <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px]">
                    <p className="text-[24px] text-secondary font-semibold pb-5 border-b">
                        {t("delivery")}
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 items-end">
                            <img
                                src="/Images/location.png"
                                alt="Position"
                                className="rounded-[12px] max-w-[80px] w-full h-auto aspect-square border"
                            />
                            <div className="flex flex-col gap-1">
                                <p className="text-primary text-[14px] font-[300]">{t("to")}</p>
                                <p className="text-[14px] text-black font-normal">
                                    {user?.addresses?.[0]?.description || t("noAddress")}
                                </p>
                            </div>
                        </div>
                        <AddAddress>
                            <Button className="w-fit">{t("addAddress")}</Button>
                        </AddAddress>
                    </div>

                    <FormField
                        control={form.control}
                        name="tel"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="font-medium text-[14px] text-gray-900">{t("contact")}</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {level === "summary" ? (
                    <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px] w-full">
                        <p className="text-[24px] text-secondary font-semibold">{t("summary")}</p>

                        <div className="relative max-w-[360px] h-[40px] w-full rounded-[20px] gap-2">
                            <Input placeholder={t("promo")} className="h-full" />
                            <Button className="h-8 absolute right-1 top-1">{t("apply")}</Button>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("subtotal")}</p>
                                <p className="text-secondary font-medium text-end">{totalPrice}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("shiping")}</p>
                                <p className="text-secondary font-medium text-end">{"0 FCFA"}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("discount")}</p>
                                <p className="text-secondary font-medium text-end">{"0 FCFA"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 pt-5 border-t">
                            <p className="text-gray-600 font-bold text-[18px]">{t("total")}</p>
                            <p className="text-secondary font-bold text-[18px] text-end">{totalPrice}</p>
                        </div>

                        {
                            user ?
                                <Button onClick={() => setLevel("paiement")} className="h-12 rounded-[24px]">
                                    {t("continue")}
                                </Button>
                                :
                                <LoginDialog>
                                    <Button className="h-12 rounded-[24px]">
                                        {t("continue")}
                                    </Button>
                                </LoginDialog>
                        }
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px]">
                        <p className="text-[24px] text-secondary font-semibold pb-5 border-b">{t("payment")}</p>

                        <div className="flex flex-col gap-3 w-full">
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="font-medium text-[14px] text-gray-900 w-full">
                                            {t("payment")}
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t("payment")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t("payment")}</SelectLabel>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="orange">Orange Money</SelectItem>
                                                    <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {["orange", "mtn"].includes(paymentMethod) && (
                                <FormField
                                    control={form.control}
                                    name="paymentNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-2">
                                            <FormLabel className="font-medium text-[14px] text-gray-900">{t("number")}</FormLabel>
                                            <FormControl>
                                                <Input type="tel" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {
                                user ?
                                    <Button type="submit" className="h-12 rounded-[24px]">
                                        {t("continue")}
                                    </Button>
                                    :
                                    <LoginDialog>
                                        <Button className="h-12 rounded-[24px]">
                                            {t("continue")}
                                        </Button>
                                    </LoginDialog>
                            }
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default DeliveryPaymentForm
