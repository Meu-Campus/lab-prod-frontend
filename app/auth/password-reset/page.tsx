'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/hooks/axios.hook";
import { useState } from "react";
import { toast } from "sonner";
import { HeaderComponent } from "@/components/header-component";
import { SchoolIconComponent } from "@/components/school-icon-component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { usePasswordReset } from "@/hooks/password-reset.hook";
import { useSearchParams } from "next/navigation";

const recoverySchema = z.object({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof recoverySchema>;

export default function PasswordReset() {
  const searchParams = useSearchParams();

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
  } = usePasswordReset<any, ApiResponse<any>>();
  const [errorList, setErrorList] = useState<string[]>([]);

  const onSubmit = (data: FormData) => {
    setErrorList([]);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return;
    }

    mutate({
      ...data,
      email: email,
      token: token
    }, {
      onError: (error) => {
        setErrorList(error?.response?.data?.errors.map((res: any) => res.message) || []);
        toast("Erro ao resetar senha!");
      },
      onSuccess: (data) => {
        toast("Senha recuperada com sucesso!");
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
            <h2 className="text-3xl text-black">Crie uma nova senha</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-2">
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
              Redefinir Senha
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}