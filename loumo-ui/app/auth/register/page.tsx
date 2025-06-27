"use client";

import SignInForm from "@/components/Auth/SignInForm";
import UserQuery from "@/queries/user";
import { User } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
  const user = new UserQuery();
  const userData = useMutation({
    mutationKey: ["userRegister"],
    mutationFn: (
      data: Omit<User, "id"> & {
        addressList?: number[];
      }
    ) => user.register(data),
  });

    return (
      <div>
        <SignInForm />
      </div>
    );
};

export default Page;
