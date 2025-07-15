"use client";

import { SchoolIconComponent } from "@/components/school-icon-component";
import Image from "next/image";
import { useGetMeInfo } from "@/hooks/me-info.hook";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UserEditFormComponent } from "@/components/user-edit-form.component";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  loggedIn?: boolean;
}

export function HeaderComponent({ loggedIn }: IProps) {
  const { data: user, isLoading, isError } = useGetMeInfo();
  const [isEditOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <header className="border-b border-neutral-200 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <SchoolIconComponent size={25} />
            <span className="text-xl text-black">Meu Campus</span>
          </div>

          {loggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex-row flex gap-4 items-center">
                  <button className="rounded-2xl overflow-hidden w-10 h-10 cursor-pointer">
                    {isLoading ? (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    ) : (
                      <Image
                        src={user?.avatar ?? "/avatar.png"}
                        alt="profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    )}
                  </button>
                  <div className="flex flex-col justify-center">
                    <Label>
                      {isLoading ? <Skeleton className="h-4 w-20" /> : user?.name ?? "Usuário"}
                    </Label>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  Editar perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={logout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {loggedIn && (
            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>

                <UserEditFormComponent />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
