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
import { useStore } from "@/providers/datastore"
import { useQuery } from "@tanstack/react-query"
import ZoneQuery from "@/queries/zone"
import { AuthDialog } from "../Auth/Dialog"

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

const formSchema2 = z.object({
    lieu: z.string().min(2, { message: "Description requise" }),
})

type FormValues = z.infer<typeof formSchema>

const DeliveryPaymentForm = ({ user, onValidate, totalPrice }: { user: User | null; onValidate: () => void; totalPrice: number }) => {
    const t = useTranslations("Cart")
    const [level, setLevel] = useState<"summary" | "paiement">("summary")
    const { address, setOrderNote} = useStore();

    const zoneQuery = new ZoneQuery();
    const zoneData = useQuery({
        queryKey: ["zoneData"],
        queryFn: () => zoneQuery.getAll()
    })

    const frais = zoneData.data?.find(x => x.id === address?.zoneId)?.price ?? 0

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tel: user?.tel?.toString() || "",
            paymentMethod: "cash",
            paymentNumber: user?.tel?.toString() || "",
        },
    })

    const form2 = useForm({
        resolver: zodResolver(formSchema2),
        defaultValues: {
            lieu: "",
        },
    })

    const paymentMethod = form.watch("paymentMethod")

    const onSubmit = () => {
        onValidate()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col max-w-[515px] w-full gap-0 md:gap-7">

                {/* LIVRAISON */}
                <div className="flex flex-col gap-5 px-6 py-7 border-b">
                    <p className="text-[24px] text-secondary font-semibold">
                        {t("delivery")}
                    </p>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 md:gap-4 items-center">
                            <img
                                src="/Images/location.png"
                                alt="Position"
                                className="rounded-[12px] max-w-[50px] md:max-w-[80px] w-full h-auto aspect-square border"
                            />
                            <div className="flex flex-col">
                                <p className="text-primary text-[18px] font-[300] leading-[100%]">{t("to")}</p>
                                <p className="text-[16px] text-black font-normal">
                                    {address?.street || t("noAddress")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Champ lieu avec validation visible */}
                    <Form {...form2}>
                        <FormField
                            control={form2.control}
                            name="lieu"
                            render={({ field }) => (
                                <FormItem className="flex flex-row md:flex-col gap-2">
                                    <FormLabel className="font-medium text-[14px] text-gray-900 text-nowrap">{t("lieu")} :</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} placeholder={t("exLieu")} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Form>

                    <FormField
                        control={form.control}
                        name="tel"
                        render={({ field }) => (
                            <FormItem className="flex flex-row md:flex-col gap-2">
                                <FormLabel className="font-medium text-[14px] text-gray-900 text-nowrap">{t("contact")} :</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} placeholder={t("exContact")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* ÉTAPE SUMMARY */}
                {level === "summary" ? (
                    <div className="flex flex-col gap-5 px-6 py-5 md:py-7 rounded-[12px] w-full">
                        <p className="text-[24px] text-secondary font-semibold">{t("summary")}</p>

                        <div className="relative max-w-[360px] h-[40px] w-full rounded-[20px] gap-2">
                            <Input placeholder={t("promo")} className="h-full" />
                            <Button type="button" className="h-8 absolute right-1 top-1">{t("apply")}</Button>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("subtotal")}</p>
                                <p className="text-secondary font-medium text-end">{totalPrice}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("shiping")}</p>
                                <p className="text-secondary font-medium text-end">{`${frais} FCFA`}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <p className="text-gray-600 font-medium">{t("discount")}</p>
                                <p className="text-secondary font-medium text-end">{"0 FCFA"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5 pt-5 border-t">
                            <p className="text-gray-600 font-bold text-[18px]">{t("total")}</p>
                            <p className="text-secondary font-bold text-[18px] text-end">{`${totalPrice + frais} FCFA`}</p>
                        </div>

                        {user ? (
                            <Button
                                type="button"
                                className="h-12 rounded-[24px]"
                                onClick={async (e) => {
                                        e.preventDefault();
                                        const isValid = await form2.trigger();
                                        if (isValid) {
                                            setOrderNote(form2.getValues("lieu"));
                                            setLevel("paiement");
                                        }
                                    }}
                            >
                                {t("continue")}
                            </Button>
                        ) : (
                            <AuthDialog>
                                <Button
                                    type="button"
                                    className="h-12 rounded-[24px]"
                                >
                                    {t("continue")}
                                </Button>
                            </AuthDialog>
                        )}
                    </div>
                ) : (
                    // ÉTAPE PAIEMENT
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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

                            {user ? (
                                <Button type="submit" className="h-12 rounded-[24px]">
                                    {t("continue")}
                                </Button>
                            ) : (
                                <AuthDialog>
                                    <Button className="h-12 rounded-[24px]">
                                        {t("continue")}
                                    </Button>
                                </AuthDialog>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default DeliveryPaymentForm
