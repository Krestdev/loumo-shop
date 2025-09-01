"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import UserQuery from "@/queries/user";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { RegisterPayload } from "@/types/types";
// import GoogleLogin from "./GoogleLogin"

const formSchema = z
  .object({
    name: z.string().min(2, "Nom requis"),
    email: z.string().email({ message: "Email invalide" }),
    phone: z.string().min(9, "Numéro invalide"),
    password: z.string().min(6, { message: "Mot de passe trop court" }),
    cfPassword: z.string().min(6, { message: "Confirmation requise" }),
    condition: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions",
    }),
  })
  .refine((data) => data.password === data.cfPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["cfPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUpForm() {
  const t = useTranslations("SignUp");
  const router = useRouter();
  const user = new UserQuery();
  const [isPending, startTransition] = useTransition();

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
  });

  const userRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterPayload) => user.register(data),
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: (err) => {
      console.error("Erreur d'inscription", err);
    },
  });

  const onSubmit = (values: FormData) => {
    startTransition(() => {
      userRegister.mutate({
        name: values.name,
        email: values.email.toLowerCase(),
        tel: values.phone,
        password: values.password,
      });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[512px] mx-auto py-24 flex flex-col items-center gap-10"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-center">{t("signUp")}</h1>
          <p className="text-[14px] text-gray-700 text-center">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-col items-center gap-5">
          {/* <GoogleLogin />

                    <p className="text-[14px] text-gray-700 text-center">{t("or")}</p> */}

          <div className="max-w-[360px] w-full flex flex-col gap-6">
            {/* Nom */}
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

            {/* Email */}
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

            {/* Téléphone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 677778888" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mot de passe */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
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

            {/* Conditions d'utilisation */}
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

            <div className="flex flex-col gap-4 w-full">
              <Button
                disabled={isPending || userRegister.isPending}
                type="submit"
                className="w-full"
              >
                {isPending ||
                  (userRegister.isPending && (
                    <Loader className="animate-spin mr-2" size={16} />
                  ))}
                {t("signUp")}
              </Button>
              <div className="flex items-center justify-between w-full">
                <Link
                  href={"/auth/restore-password"}
                  className="px-0 text-[14px] text-primary underline font-semibold"
                >
                  {t("forgot")}
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant={"link"}
                    className="px-0 cursor-default text-black hover:no-underline"
                  >
                    {t("alreaddy")}
                  </Button>
                  <Link
                    href={"/auth/login"}
                    className="px-0 text-[14px] text-primary underline font-semibold"
                  >
                    {t("login")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
