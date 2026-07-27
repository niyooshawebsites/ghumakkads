import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import DashboardSidebar from "../components/DashboardSidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <div>
            <TooltipProvider>
              <SidebarProvider>
                <div className=" bg-gray-50">
                  <DashboardSidebar />
                </div>
                <SidebarInset>
                  <main className="w-full p-3">
                    <SidebarTrigger />
                    {children}
                    <Toaster />
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </TooltipProvider>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
