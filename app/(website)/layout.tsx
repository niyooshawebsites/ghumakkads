import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
                <div className="flex min-h-screen w-full">
                  <div className=" bg-gray-50">
                    <AppSidebar />
                  </div>
                  <SidebarInset className="flex-1 p-3">
                    <div className="flex items-center space-x-2">
                      <SidebarTrigger className="text-3xl" />
                      <Header />
                    </div>
                    {children}
                    <Footer />
                    <Toaster />
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </TooltipProvider>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
