
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Church as ChurchIcon, LayoutDashboard, Sparkles, Users, Menu } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/members", label: "Members", icon: Users },
  { href: "/engagement-insights", label: "Engagement Insights", icon: Sparkles },
  { href: "/profile", label: "Church Profile", icon: ChurchIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed top-4 left-4 z-20 md:hidden">
        <SidebarTrigger />
      </div>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <ChurchIcon className="w-6 h-6" />
            </Button>
            <span className="font-bold text-lg text-foreground font-headline group-data-[collapsible=icon]:hidden">
              EN Indonesia
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-muted-foreground">&copy; 2024 EN Indonesia Connect</p>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
