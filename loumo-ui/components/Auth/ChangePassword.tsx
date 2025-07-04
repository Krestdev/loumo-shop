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
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useEffect } from "react"
import { Loader } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import Loading from "../setup/loading"

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Mot de passe trop court" }),
    cfPassword: z.string().min(6, { message: "Confirmation requise" }),
  })
  .refine((data) => data.password === data.cfPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["cfPassword"],
  })

type FormData = z.infer<typeof formSchema>

export default function ChangePassword({ slug }: { slug: string }) {
  const t = useTranslations("ChangePassword")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      cfPassword: "",
    },
  })

  const user = new UserQuery()
  const searchParams = useSearchParams()

  const otp = slug
  const email = searchParams.get("email")

  console.log(otp, email);


  const verifyOTP = useMutation({
    mutationKey: ["verify"],
    mutationFn: (data: {email: string, otp: string}) => user.verifyReset(data),
  })

  const resetPassword = useMutation({
    mutationKey: ["reset"],
    mutationFn: (data: {email: string, otp: string, newPassword: string}) => user.reset(data),
    onSuccess: () => {
      router.push("/auth/login")
    },
    onError: (err) => {
      console.error("Erreur de mise à jour :", err)
    },
  })

  useEffect(() => {
    email && verifyOTP.mutate({
      email: email,
      otp: otp
    })
  }, [])

  const onSubmit = (values: FormData) => {
    startTransition(() => {
      email && resetPassword.mutate({
        email: email,
        otp: otp,
        newPassword: values.password,
      })
    })
  }

  if (verifyOTP.isPending) return <Loading />

  if (verifyOTP.isError) {
    router.push("/auth/restore-password")
    return null
  }

  if (verifyOTP.isSuccess && verifyOTP.status !== "success") {
    router.push("/auth/restore-password")
    return null
  }

  return (
    <>
      {verifyOTP.isSuccess && verifyOTP.status === "success" && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-10"
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-center">{t("change")}</h1>
              <p className="text-[14px] text-gray-700 text-center">
                {t("description")}
              </p>
            </div>

            <div className="max-w-[360px] w-full flex flex-col gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("newPassword")}</FormLabel>
                    <FormControl>
                      <Input placeholder="********" type="password" {...field} />
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
                      <Input placeholder="********" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isPending || resetPassword.isPending}
                type="submit"
                className="w-full"
              >
                {(isPending || resetPassword.isPending) && (
                  <Loader className="animate-spin mr-2" size={16} />
                )}
                {t("verify")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}