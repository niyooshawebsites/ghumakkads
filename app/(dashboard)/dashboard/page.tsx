import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-2xl">Hey Ghumakkad</h1>
      <h1 className="text-xl">
        Welcome to the <span className="text-red-500">Adda!</span>
      </h1>
      <div className="flex bg-blue-50 overflow-y-scroll min-h-screen w-8/12"></div>
    </div>
  );
}
