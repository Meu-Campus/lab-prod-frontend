"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTeacher, useUpdateTeacher, Teacher } from "@/hooks/teacher.hook";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("O e-mail é inválido."),
});

interface TeacherFormProps {
  initialData?: Teacher;
  onSuccess?: () => void;
}

export function TeacherFormComponent({ initialData, onSuccess }: TeacherFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
    },
  });

  const { mutate: createTeacher, isPending: isCreating } = useCreateTeacher(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateTeacher, isPending: isUpdating } = useUpdateTeacher(() => {
    onSuccess?.();
  });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      updateTeacher({ id: initialData.id, ...values });
    } else {
      createTeacher(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="Ex: joao.silva@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (initialData ? "Atualizando..." : "Salvando...") : (initialData ? "Atualizar" : "Salvar")}
        </Button>
      </form>
    </Form>
  );
}
