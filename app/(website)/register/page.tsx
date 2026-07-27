import RegisterForm from "./RegisterForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <RegisterForm />
    </div>
  );
}


