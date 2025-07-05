'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { z } from "zod";
import { useUpdateMe } from "@/hooks/update-me.hook";
import { ApiResponse } from "@/hooks/axios.hook";

const userSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  avatar: z.any().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserEditFormComponent() {
  const [preview, setPreview] = useState<string | undefined>();
  const { mutate, isPending } = useUpdateMe<any, ApiResponse<any>>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);

  function submit(data: UserFormData) {
    const form = new FormData()
    form.append("name", data.name)
    form.append("email", data.email)
    if (data.avatar?.[0]) {
      form.append("image", data.avatar[0])
    }

    mutate(
      form
    )
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <Label>Avatar</Label>
        {preview && (
          <div className="mb-2 w-20 h-20 relative rounded-full overflow-hidden border">
            <Image src={preview} alt="avatar preview" fill style={{ objectFit: "cover" }}/>
          </div>
        )}
        <Input type="file" accept="image/*" {...register("avatar")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Salvar
      </Button>
    </form>
  );
}
