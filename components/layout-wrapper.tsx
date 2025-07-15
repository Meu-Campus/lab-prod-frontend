"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar.component";
import { HeaderComponent } from "@/components/header-component.tsx";
import { SchoolIconComponent } from "@/components/school-icon-component";
import { Toaster } from "@/components/ui/sonner";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <div className="flex-1">
        {!isAuthPage && <HeaderComponent loggedIn={true} />}
        {children}
        <Toaster position="top-right" />
      </div>
    </>
  );
}
