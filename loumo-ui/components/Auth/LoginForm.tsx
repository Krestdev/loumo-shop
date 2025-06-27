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
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader } from "lucide-react"

const phoneSchema = z.object({
  phone: z.string().min(9, "Numéro invalide"),
  password: z.string().min(6, { message: "Mot de passe trop court" }),
})

const emailSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Mot de passe trop court" }),
})

// union des deux
const loginSchema = z.union([phoneSchema, emailSchema])

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const t = useTranslations("Login")
  const [method, setMethod] = useState<"phone" | "email">("phone")
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      email: "",
      password: "",
    }
  })

  const user = new UserQuery();

  const router = useRouter();

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


  const { setUser } = useStore();

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

  const onSubmit = (values: LoginFormData) => {
    startTransition(() => {
      if ("email" in values) {
        userData.mutate({
          email: values.email.toLowerCase(),
          password: values.password,
        },)
      } else if ("phone" in values) {
        // userData.mutate({
        //   phone: values.phone,
        //   password: values.password,
        // })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-10"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-center">{t("login")}</h1>
          <p className="text-[14px] text-gray-700 text-center">{t("description")}</p>
        </div>

        <div className="max-w-[360px] w-full flex flex-col items-center gap-7">
          <div className="flex flex-col items-center gap-4 w-full">
            {method === "phone" ? (
              <Button type="button" onClick={() => setMethod("email")} variant="outline">
                {t("emailLog")}
              </Button>
            ) : (
              <Button type="button" onClick={() => setMethod("phone")} variant="outline">
                {t("phoneLog")}
              </Button>
            )}

            {method === "phone" ? (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="ex: 677 77 88 88"
                        {...field}
                        className="w-full"
                      />
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
                  <FormItem className="w-full">
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ex: exemple@email.com"
                        {...field}
                        className="w-full"
                      />
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
                <FormItem className="w-full">
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 w-full">
              <Button disabled={userData.isPending || isPending} type="submit" className="w-full">
                {isPending || userData.isPending && <Loader className='animate-spin mr-2' size={16} />}
                {t("login")}
              </Button>
              <div className="flex items-center justify-between w-full">
                <Link href={"/auth/restore-password"} className="px-0 text-[14px] text-primary underline font-semibold">{t("forgot")}</Link>
                <div className="flex items-center gap-2">
                  <Button variant={"link"} className="px-0 cursor-default no-underline text-black">{t("notYet")}</Button>
                  <Link href={"/auth/register"} className="px-0 text-[14px] text-primary underline font-semibold">{t("signIn")}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
