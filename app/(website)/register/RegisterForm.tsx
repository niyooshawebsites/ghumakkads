"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/app/actions/auth-actions";
import { useActionState, useState } from "react";
import Link from "next/link";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

const initialState = {
  success: false,
  msg: "",
};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex justify-center items-center w-3/12 rounded-lg">
      <div className="bg-blue-50 p-5 rounded-lg space-y-3 w-full">
        <h1 className="text-2xl">Register</h1>
        <Button
          type="button"
          variant={"secondary"}
          className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          onClick={() => signIn("google")}
        >
          Register with <span className="text-gray-900">Google</span>
        </Button>

        <hr className="text-gray-200" />

        <form action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input type="text" id="name" placeholder="John Doe" name="name" />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              type="email"
              id="email"
              placeholder="john@example.com"
              name="email"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="*************"
              />
              <InputGroupAddon align="inline-end">
                {showPassword ? (
                  <EyeOffIcon
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <EyeIcon
                    className="cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                )}
              </InputGroupAddon>
            </InputGroup>
          </Field>

          {state.success ? (
            <p className="text-green-500 text-sm">{state.msg}</p>
          ) : (
            <p className="text-red-500 text-sm">{state.msg}</p>
          )}

          <Button
            type="submit"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
            variant={"outline"}
          >
            Register
          </Button>
        </form>

        <p className="text-gray-500 text-sm">
          Aready havean account?{" "}
          <span className="text-blue-500">
            <Link href="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
