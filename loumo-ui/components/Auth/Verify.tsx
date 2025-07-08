"use client"

import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import Loading from "../setup/loading"
import { useStore } from "@/providers/datastore"


export default function Verify({ slug }: { slug: string }) {

    const user = new UserQuery();
    const { setUser } = useStore();

    const userData = useMutation({
        mutationKey: ["login"],
        mutationFn: (data: { email: string; password: string }) => user.login(data),
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.error("Échec de connexion :", error);
        },
    });

    useEffect(() => {
        const setToken = () => {
            if (userData.isSuccess) {
                setUser(userData.data.user);
                localStorage.setItem("token", userData.data?.token);
            }
        };

        return () => {
            setToken();
        };
    }, [userData.data, setUser, userData.isSuccess]);


    const router = useRouter()
    const searchParams = useSearchParams()

    const otp = slug
    const email = searchParams.get("email")
    const t = useTranslations("SignUp")

    const verifyEmail = useMutation({
        mutationKey: ["verify"],
        mutationFn: (data: {email: string, otp: string}) => user.verify(data),
    })

    useEffect(() => {
        verifyEmail.mutate({
            email: email!,
            otp: otp
        })
    }, [email, otp, verifyEmail])

    if (verifyEmail.isPending) return <Loading />

    if (verifyEmail.isError) {
        router.push("/auth/restore-password")
        return null
    }

    if (verifyEmail.isSuccess && verifyEmail.status !== "success") {
        router.push("/auth/restore-password")
        return null
    }

    router.push("/auth/login")

    return (
        <>
            {verifyEmail.isSuccess && verifyEmail.status === "success" && (
                <div
                    className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-5"
                >
                    <img src="/Images/success.png" alt="success" className='max-w-[150px] w-full h-auto aspect-square' />
                    <h1 className="text-center">{t("verified")}</h1>
                </div>
            )}
        </>
    )
}