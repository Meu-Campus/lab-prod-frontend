'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeaderComponent } from "@/components/header-component";
import { SchoolIconComponent } from "@/components/school-icon-component";
import { useRegisterUser } from "@/hooks/register.hook";
import { useState } from "react";
import { ApiResponse } from "@/hooks/axios.hook";
import { toast } from "sonner"
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });
  const {
    mutate,
    isPending,
  } = useRegisterUser<any, ApiResponse<any>>();
  const [errorList, setErrorList] = useState<string[]>([]);

  const onSubmit = (data: FormData) => {
    setErrorList([]);
    mutate(data, {
      onError: (error) => {
        setErrorList(error?.response?.data?.errors.map((res: any) => res.message) || []);
        toast("Ocorreu um erro ao registrar o usuário");
      },
      onSuccess: (data) => {
        toast("Usuário registrado com sucesso!");
      }
    });
  };

  return (
    <div className="min-h-screen w-full">
      <HeaderComponent/>

      <main id="login-main" className="flex items-center justify-center px-4 py-12 h-full">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center flex flex-col items-center">
            <SchoolIconComponent/>
            <h2 className="text-3xl text-black">Registrar no Meu Campus</h2>
            <p className="mt-2 text-neutral-600">Organize sua vida acadêmica</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-2">
              <div>
                <label htmlFor="name" className="block text-sm text-black mb-1">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome"
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                {errors.name && (
                  <p role="alert" className="text-red-700 text-[12px] font-bold mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-black mb-1">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p role="alert" className="text-red-700 text-[12px] font-bold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm text-black mb-1">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p role="alert" className="text-red-700 text-[12px] font-bold mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {errorList.length > 0 &&
              errorList.map((item, index) => (
                <p key={index} role="alert" className="text-red-700 text-[12px] font-bold mt-1">
                  {item}
                </p>
              ))
            }

            <Button type="submit" className="w-full" loading={isPending}>
              Registrar
            </Button>

            <div className="text-center">
              <span className="text-neutral-600">Já possui uma conta? </span>
              <Link href="/auth/login" className="text-black hover:underline cursor-pointer">Faça login</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
