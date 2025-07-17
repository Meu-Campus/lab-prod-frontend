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

import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription } from "./ui/form";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  subjectId: z.string().min(1, "A disciplina é obrigatória."),
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().optional(),
  dueDate: z.string().min(1, "A data de entrega é obrigatória."),
  isDelivered: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  initialData?: Task;
  subjects: Subject[];
  onSuccess?: () => void;
}

function TaskForm({ initialData, subjects, onSuccess }: TaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        subjectId: initialData.subjectId,
        title: initialData.title,
        description: initialData.description,
        dueDate: initialData.dueDate.slice(0, 16),
        isDelivered: initialData.isDelivered,
      }
      : {
        subjectId: "",
        title: "",
        description: "",
        dueDate: "",
        isDelivered: false,
      },
  });

  const { mutate: createTask, isPending: isCreating } = useCreateTask(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(() => {
    onSuccess?.();
  });

  const isPending = isCreating || isUpdating;

  function onSubmit(values: FormValues) {
    const dataToSend = {
      ...values,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : "",
    };

    if (initialData) {
      updateTask({ id: initialData.id, ...dataToSend });
    } else {
      createTask(dataToSend);
    }
  }

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subject.id,
        title: initialData.title,
        description: initialData.description,
        dueDate: initialData.dueDate.slice(0, 16),
        isDelivered: initialData.isDelivered,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
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
                <Input placeholder="Ex: Fazer trabalho de matemática" {...field} />
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
                <Input placeholder="Ex: Entregar até sexta-feira" {...field} />
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
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDelivered"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Tarefa Entregue
                </FormLabel>
                <FormDescription>
                  Marque se esta tarefa já foi entregue.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (initialData ? "Atualizando..." : "Criando...") : (initialData ? "Atualizar Tarefa" : "Criar Tarefa")}
        </Button>
      </form>
    </Form>
  );
}

// --- Loading Skeleton ---
function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full"/></div>
      <div className="space-y-2"><Skeleton className="h-4 w-20"/><Skeleton className="h-10 w-full"/></div>
      <div className="space-y-2"><Skeleton className="h-4 w-28"/><Skeleton className="h-10 w-full"/></div>
      <div className="space-y-2"><Skeleton className="h-4 w-24"/><Skeleton className="h-10 w-full"/></div>
      <div className="space-y-2"><Skeleton className="h-4 w-12"/><Skeleton className="h-10 w-full"/></div>
      <Skeleton className="h-10 w-32"/>
    </div>
  );
}

// --- Main Exported Component (Data Fetching Orchestrator) ---
interface TaskFormComponentProps {
  initialData?: Task;
  onSuccess?: () => void;
}

export function TaskFormComponent({ initialData, onSuccess }: TaskFormComponentProps) {
  const { data: subjects, isLoading: isLoadingSubjects } = useGetAllSubjects();

  const isLoading = isLoadingSubjects;

  // Show skeleton until subjects are loaded.
  if (isLoading) {
    return <FormSkeleton/>;
  }

  // Render the actual form only when data is available, passing it as props.
  return (
    <TaskForm
      initialData={initialData}
      subjects={subjects || []}
      onSuccess={onSuccess}
    />
  );
}