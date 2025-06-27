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
import { Awaiting } from "./Dialog/Awating"
import { Success } from "./Dialog/Success"

// ✅ Schéma Zod
const formSchema = z.object({
    tel: z
        .string()
        .min(8, { message: "Numéro trop court" })
        .max(15, { message: "Numéro trop long" }),
    paymentMethod: z.string().nonempty({ message: "Mode de paiement requis" }),
    paymentNumber: z
        .string()
        .min(8, { message: "Numéro trop court" })
        .max(15, { message: "Numéro trop long" }),
})

type FormValues = z.infer<typeof formSchema>

const DeliveryPaymentForm = ({ user }: { user: User | null }) => {
    const t = useTranslations("Cart")

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tel: user?.tel?.toString() || "",
            paymentMethod: "",
            paymentNumber: user?.tel?.toString() || "",
        },
    })

    const onSubmit = (values: FormValues) => {
        console.log("Form submitted:", values)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col max-w-[515px] w-full gap-7"
            >
                {/* DELIVERY */}
                <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px]">
                    <p className="text-[24px] text-secondary font-semibold pb-5 border-b">
                        {t("delivery")}
                    </p>

                    <div className="flex gap-4 items-end">
                        <img
                            src="/Images/location.png"
                            alt="Position"
                            className="rounded-[12px] max-w-[80px] w-full h-auto aspect-square border"
                        />
                        <div className="flex flex-col gap-1">
                            <p className="text-primary text-[14px] font-[300]">{t("to")}</p>
                            <p className="text-[14px] text-black font-normal">
                                {user?.addresses?.[0]?.description}
                            </p>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="tel"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-2">
                                <FormLabel className="font-medium text-[14px] text-gray-900">
                                    {t("contact")}
                                </FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* PAYMENT */}
                <div className="flex flex-col gap-5 px-6 py-7 rounded-[12px]">
                    <p className="text-[24px] text-secondary font-semibold pb-5 border-b">
                        {t("payment")}
                    </p>

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

                        <FormField
                            control={form.control}
                            name="paymentNumber"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2">
                                    <FormLabel className="font-medium text-[14px] text-gray-900">
                                        {t("number")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Success>
                            <Button type="submit">{t("continue")}</Button>
                        </Success>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default DeliveryPaymentForm
