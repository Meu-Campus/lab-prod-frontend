"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Book, Users, CalendarCheck, ListTodo } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/teachers",
      label: "Professores",
      icon: Users,
      active: pathname === "/teachers",
    },
    {
      href: "/subjects",
      label: "Disciplinas",
      icon: Book,
      active: pathname === "/subjects",
    },
    {
      href: "/classes",
      label: "Aulas",
      icon: CalendarCheck,
      active: pathname === "/classes",
    },
    {
      href: "/tasks",
      label: "Tarefas",
      icon: ListTodo,
      active: pathname === "/tasks",
    },
  ];

  return (
    <div className="flex h-full w-60 flex-col overflow-y-auto border-r bg-background pt-4">
      <nav className="flex-1 space-y-2 px-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              route.active ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            <route.icon className="mr-3 h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
