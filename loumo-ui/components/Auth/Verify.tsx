"use client"

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import Loading from "../setup/loading"
import { useStore } from "@/providers/datastore"
import { toast } from "react-toastify"

export default function Verify({ slug }: { slug: string }) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const t = useTranslations("SignUp")

    const user = new UserQuery()
    const { setUser } = useStore()

    const otp = slug
    const email = searchParams.get("email")

    const verifyEmail = useMutation({
        mutationKey: ["verify"],
        mutationFn: (data: { email: string, otp: string }) => user.verify(data),
        onError: () => {
            toast.error("Échec de vérification")
        }
    })

    useEffect(() => {
        if (email && otp) {
            verifyEmail.mutate({ email, otp })
        }
    }, [email, otp])

    if (verifyEmail.isPending) return <Loading />

    if (verifyEmail.isError) return null

    return (
        <>
            {verifyEmail.isSuccess ? (
                <div className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-5">
                    <img
                        src="/Images/success.png"
                        alt="success"
                        className='max-w-[150px] w-full h-auto aspect-square'
                    />
                    <h1 className="text-center">{t("verified")}</h1>
                </div>
            ) : <Loading status="failed" />
            }
        </>
    )
}
