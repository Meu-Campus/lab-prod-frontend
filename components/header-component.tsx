'use client'

import { SchoolIconComponent } from "@/components/school-icon-component";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginUser } from "@/hooks/login.hook";
import { ApiResponse } from "@/hooks/axios.hook";
import { useMeInfo } from "@/hooks/me-info.hook";
import { useEffect } from "react";
import { toast } from "sonner";

interface IProps {
  loggedIn?: boolean;
}

export function HeaderComponent(props: IProps) {
  const { mutate, isPending } = useMeInfo<any, ApiResponse<any>>();

  useEffect(() => {
    mutate(undefined, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: () => {
        toast("Erro ao ler usuário!");
      }
    });
  }, []);


  return (
    <header id="header" className="border-b border-neutral-200 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <SchoolIconComponent size={45}/>
            <span className="text-xl text-black">Meu Campus</span>
          </div>

          {/*<Image src=alt="profile" width={40} height={40}/>*/}
        </div>
      </div>
    </header>
  )
}