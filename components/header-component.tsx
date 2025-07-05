'use client'

import { SchoolIconComponent } from "@/components/school-icon-component";
import Image from "next/image";
import { useMeInfo } from "@/hooks/me-info.hook";
import { ApiResponse } from "@/hooks/axios.hook";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { UserEditFormComponent } from "@/components/user-edit-form.component";

interface IProps {
  loggedIn?: boolean;
}

export function HeaderComponent(props: IProps) {
  const { mutate } = useMeInfo<any, ApiResponse<any>>();
  const [isEditOpen, setEditOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (props.loggedIn) {
      mutate(undefined, {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: () => {
          toast("Erro ao ler usuário!");
        }
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <header className="border-b border-neutral-200 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <SchoolIconComponent size={45} />
            <span className="text-xl text-black">Meu Campus</span>
          </div>

          {props.loggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full overflow-hidden w-10 h-10">
                  <Image
                    src="/avatar.png"
                    alt="profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </button>
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

          {props.loggedIn && (
            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>

                <UserEditFormComponent/>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
