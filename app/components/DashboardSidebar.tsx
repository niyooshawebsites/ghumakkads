import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Home,
  Users,
  UserPen,
  KeySquare,
  ChartColumnStacked,
  SquareLibrary,
  LogOut,
  ChevronDown,
  CirclePlus,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { logOutUser } from "../actions/auth-actions";
import { auth } from "@/lib/auth";

const categoryItems = [
  {
    title: "All Categories",
    icon: List,
    link: "/dashboard/categories",
  },
  {
    title: "Create Category",
    icon: CirclePlus,
    link: "/dashboard/category/create",
  },
];

const postItems = [
  {
    title: "All Posts",
    icon: List,
    link: "/dashboard/posts",
  },
  {
    title: "Create Post",
    icon: CirclePlus,
    link: "/dashboard/post/create",
  },
];

const userItems = [
  {
    title: "All Users",
    icon: Users,
    link: "/dashboard/users",
  },
];

const settingItems = [
  {
    title: "Profile",
    icon: UserPen,
    link: "/dashboard/settings/profile/edit",
  },
  {
    title: "Password",
    icon: KeySquare,
    link: "/dashboard/settings/password/edit",
  },
];

export default async function DashboardSidebar() {
  const session = await auth();

  return (
    <Sidebar collapsible="icon" className="border border-gray-200">
      {/* HEADER */}
      <SidebarHeader className="border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" className="flex items-center gap-2 p-2">
                <div className="flex h-8 w-8  items-center justify-center rounded-md text-blue-500">
                  <Home size={18} />
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold">Ghumakkads</span>
                  <span className="text-xs text-muted-foreground">
                    DASHBOARD
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {/* CATEGORIES */}
        {session?.user.role === 1 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <CollapsibleTrigger className="w-full flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                        <ChartColumnStacked className="h-4 w-4" /> Categories
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarMenuButton>

                    <CollapsibleContent className="group-data-[collapsible=icon]/sidebar:hidden">
                      <SidebarMenu className="mt-1 space-y-1">
                        {categoryItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={item.link}
                                className="flex w-full items-center gap-2 px-2 py-1 pl-8 hover:bg-gray-100 p-2 rounded-lg"
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <></>
        )}

        {/* POSTS */}
        <SidebarGroup>
          <SidebarGroupLabel>Posts</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger className="w-full flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                      <SquareLibrary className="h-4 w-4" /> Posts
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>

                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="mt-1 space-y-1">
                      {postItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.link}
                              className="flex w-full items-center gap-2 px-2 py-1 pl-8 hover:bg-gray-100 p-2 rounded-lg"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* USERS */}
        {session?.user.role === 1 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible className="group/collapsible">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <CollapsibleTrigger className="w-full flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                        <Users className="h-4 w-4" /> Users
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarMenuButton>

                    <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                      <SidebarMenu className="mt-1 space-y-1">
                        {userItems.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <Link
                                href={item.link}
                                className="flex w-full items-center gap-2 px-2 py-1 pl-8 hover:bg-gray-100 p-2 rounded-lg"
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <></>
        )}

        {/* SETTINGS */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible className="group/collapsible">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger className="w-full flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg">
                      <UserPen className="h-4 w-4" /> Settings
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>

                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="mt-1 space-y-1">
                      {settingItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.link}
                              className="flex w-full items-center gap-2 px-2 py-1 pl-8 hover:bg-gray-100 p-2 rounded-lg"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-gray-200 p-2">
        <div className="flex items-center justify-between group-data-[collapsible=icon]/sidebar:justify-center">
          <SidebarMenuButton asChild>
            <div className="group-data-[collapsible=icon]/sidebar:hidden">
              {session?.user?.name || "Ghost"}
            </div>
          </SidebarMenuButton>

          <form action={logOutUser}>
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
