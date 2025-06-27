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
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import UserQuery from "@/queries/user"
import { useRouter } from "next/navigation"
import { useStore } from "@/providers/datastore"
import { useTransition } from "react"
import { Loader } from "lucide-react"

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
  const { setUser } = useStore()
  const user = new UserQuery()
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      cfPassword: "",
    },
  })

  const userUpdate = useMutation({
    mutationKey: ["update"],
    mutationFn: (data: any) => user.update(17, data),
    onSuccess: () => {
      router.push("/auth/login")
    },
    onError: (err) => {
      console.error("Erreur d'inscription", err)
    },
  })

  const onSubmit = (values: FormData) => {
    startTransition(() => {
      userUpdate.mutate({
        email: slug,
        password: values.password,
      })

      console.log(`email: ${decodeURI(slug)} password: ${values.password}`);
      
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-10"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-center">{t("change")}</h1>
          <p className="text-[14px] text-gray-700 text-center">{t("description")}</p>
        </div>

        <div className="max-w-[360px] w-full flex flex-col gap-6">
          {/* Mot de passe */}
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

          {/* Confirmation mot de passe */}
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
          <Button disabled={isPending || userUpdate.isPending} type="submit" className="w-full">
            {isPending || userUpdate.isPending && <Loader className='animate-spin mr-2' size={16} />}
            {t("verify")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
