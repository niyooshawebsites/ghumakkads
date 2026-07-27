import LoginForm from "./LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginForm />
    </div>
  );
}
