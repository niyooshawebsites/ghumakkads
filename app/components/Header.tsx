"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserCheck, UserPlus, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  let isLoggedIn = false;

  if (session?.user.id) {
    isLoggedIn = true;
  }

  return (
    <header className="flex justify-between items-center rounded-md px-3 py-2 w-full border">
      <div className="flex justify-center items-center">
        <Link href="/">
          <h1 className="yesteryear-regular text-4xl" style={{}}>
            <Image src="/logo.png" alt="logo" width="150" height="80" />
          </h1>
        </Link>
      </div>
      <nav className="flex">
        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="cursor-pointer hover:font-bold">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/posts"
                  className="cursor-pointer hover:font-bold"
                >
                  Posts
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            >
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20 mr-4 mt-4" align="start">
            {isLoggedIn ? (
              <DropdownMenuGroup>
                <Link href="/dashboard">
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                    <LayoutDashboard />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <Link href="/login">
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                    <UserCheck />
                    Login
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="bg-gray-200" />

                <Link href="/register">
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer">
                    <UserPlus /> Register
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
