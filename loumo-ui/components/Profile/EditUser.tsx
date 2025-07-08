import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { User } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import UserQuery from "@/queries/user";

const formSchema = z.object({
    name: z.string().min(4),
    tel: z.string().min(9).optional()
});

interface Props {
    children: React.JSX.Element,
    user: User
}

export function EditUser({ children, user }: Props) {
    const t = useTranslations("Profile");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name ?? "",
            tel: user.tel ?? ""
        }
    })

    const userQuery = new UserQuery();
    const userData = useMutation({
        mutationKey: ["login"],
        mutationFn: (data: { name: string, tel?: string }) => userQuery.update(user.id, data),
        onError: (error) => {
            console.error("Échec de connexion :", error);
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);

        if (values.tel) {
            userData.mutate({
                name: values.name,
                tel: values.tel,
            });
        } else {
            userData.mutate({
                name: values.name,
            });
        }
    }


    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t("editTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("editDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("fullName")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"

                                                type="text"
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("phoneNumber")}</FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[20px] w-full">
                                                <Input
                                                    placeholder="677887788"
                                                    className="pl-14"
                                                    type=""
                                                    {...field} />
                                                <div className="absolute bg-accent/20 rounded-l-[20px] top-[0%] h-9 flex items-center justify-center px-2 -z-10">
                                                    <p className="text-gray-900">{"+237"}</p>
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">{t("save")}</Button>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">{t("close")}</Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </form>
        </Dialog>
    )
}
