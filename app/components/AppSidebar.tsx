import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, SquareLibrary } from "lucide-react";
import { fetchAllCategories } from "../actions/category-action";
import Image from "next/image";

const postsByCategory = (id: string) => {
  const link = `/category/${id}`;
  return link;
};

export default async function AppSidebar() {
  const res = await fetchAllCategories();
  const categories = res.data;

  return (
    <Sidebar collapsible="icon" className="border border-gray-200">
      {/* Header */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home />
                <Image src="/logo.png" alt="logo" width="100" height="80" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {categories.map((category) => (
                <SidebarMenuItem key={category.id}>
                  <SidebarMenuButton
                    asChild
                    className="bg-blue-500 text-gray-100 hover:bg-blue-600 cursor-pointer hover:text-gray-100"
                  >
                    <Link href={postsByCategory(category.id)}>
                      <SquareLibrary />
                      <span>{category.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
