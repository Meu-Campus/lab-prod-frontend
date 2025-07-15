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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllSubjects } from "@/hooks/subject.hook";
import { useCreateTask, useUpdateTask, Task } from "@/hooks/task.hook";
import { useEffect } from "react";

const formSchema = z.object({
  subjectId: z.string().min(1, "A disciplina é obrigatória."),
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  dueDate: z.string().min(1, "A data de entrega é obrigatória."),
});

interface TaskFormProps {
  initialData?: Task;
  onSuccess?: () => void;
}

export function TaskFormComponent({ initialData, onSuccess }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: initialData?.subjectId || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      dueDate: initialData?.dueDate ? initialData.dueDate.split('T')[0] : "",
    },
  });

  const { data: subjects } = useGetAllSubjects();
  const { mutate: createTask, isPending: isCreating } = useCreateTask(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(() => {
    onSuccess?.();
  });

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subject.id,
        title: initialData.title,
        description: initialData.description,
        dueDate: initialData.dueDate.split('T')[0],
      });
    }
  }, [initialData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      dueDate: new Date(values.dueDate).toISOString(),
    };

    if (initialData) {
      updateTask({ id: initialData.id, ...data });
    } else {
      createTask(data);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Prova Parcial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Capítulos 3 e 4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Entrega</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (initialData ? "Atualizando..." : "Salvando...") : (initialData ? "Atualizar Tarefa" : "Criar Tarefa")}
        </Button>
      </form>
    </Form>
  );
}
