"use client";

import { loginUser } from "../../actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const initialState = {
  success: false,
  msg: "",
};

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="flex justify-center items-center w-3/12 rounded-lg">
      <div className=" bg-blue-50 rounded-lg p-5 space-y-4 w-full">
        <h1 className="text-2xl">Login</h1>

        <Button
          type="button"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          variant={"secondary"}
          onClick={() => signIn()}
        >
          Login with <span className="text-gray-900">Google</span>
        </Button>

        <hr className="text-gray-200" />

        <form action={formAction} className="space-y-3">
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
            variant={"outline"}
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Login
          </Button>
        </form>

        <p className="text-gray-500 text-sm">
          Don&#39;t have an account?{" "}
          <span className="text-blue-500">
            <Link href="/register">Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
