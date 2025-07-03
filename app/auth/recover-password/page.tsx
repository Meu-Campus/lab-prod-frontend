'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/hooks/axios.hook";
import { toast } from "sonner";
import { HeaderComponent } from "@/components/header-component";
import { SchoolIconComponent } from "@/components/school-icon-component";
import { z } from "zod";
import { useRecoveryLink } from "@/hooks/recovery-link.hook";
import { useState } from "react";

const recoverySchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type FormData = z.infer<typeof recoverySchema>;

export default function RecoverPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(recoverySchema),
  });
  const {
    mutate,
    isPending,
    isSuccess
  } = useRecoveryLink<any, ApiResponse<any>>();
  const [errorList, setErrorList] = useState<string[]>([]);

  const onSubmit = (data: FormData) => {
    setErrorList([]);
    mutate(data, {
      onError: (error) => {
        setErrorList(error?.response?.data?.errors.map((res: any) => res.message) || []);
        toast("Erro ao enviar link!");
      },
      onSuccess: (data) => {
        toast("Link de recuperação enviado com sucesso!");
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
            <h2 className="text-3xl text-black">Recuperar Senha</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-2">
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
            </div>

            {errorList.length > 0 &&
              errorList.map((item, index) => (
                <p key={index} role="alert" className="text-red-700 text-[12px] font-bold mt-1">
                  {item}
                </p>
              ))
            }

            <Button type="submit" className="w-full" disabled={isSuccess} loading={isPending}>
              Enviar Link de Recuperação
            </Button>

            {isSuccess && (
              <p className="text-green-700 text-[13px] font-bold mt-1 text-center">
                Link de recuperação enviado com sucesso! Verifique seu e-mail.
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}