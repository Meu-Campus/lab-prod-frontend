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
import { useGetTeachers } from "@/hooks/teacher.hook";
import { useGetSubjects } from "@/hooks/subject.hook";
import { useScheduleClass, useUpdateClass, Class } from "@/hooks/class.hook";
import { useEffect } from "react";

const formSchema = z.object({
  subjectId: z.string().min(1, "A disciplina é obrigatória."),
  teacherId: z.string().min(1, "O professor é obrigatório."),
  startTime: z.string().min(1, "O horário de início é obrigatório."),
  endTime: z.string().min(1, "O horário de fim é obrigatório."),
  room: z.string().min(1, "A sala é obrigatória."),
});

interface ScheduleClassFormProps {
  initialData?: Class;
  onSuccess?: () => void;
}

export function ScheduleClassFormComponent({ initialData, onSuccess }: ScheduleClassFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectId: initialData?.subject.id || "",
      teacherId: initialData?.teacher.id || "",
      startTime: initialData?.startTime ? initialData.startTime.slice(0, 16) : "",
      endTime: initialData?.endTime ? initialData.endTime.slice(0, 16) : "",
      room: initialData?.room || "",
    },
  });

  const { data: teachers } = useGetTeachers();
  const { data: subjects } = useGetSubjects();
  const { mutate: scheduleClass, isPending: isScheduling } = useScheduleClass(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass(() => {
    onSuccess?.();
  });

  const isPending = isScheduling || isUpdating;

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subject.id,
        teacherId: initialData.teacher.id,
        startTime: initialData.startTime.slice(0, 16),
        endTime: initialData.endTime.slice(0, 16),
        room: initialData.room,
      });
    }
  }, [initialData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      updateClass({ id: initialData.id, ...values });
    } else {
      scheduleClass(values);
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
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
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
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Início</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Fim</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala 201" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (initialData ? "Atualizando..." : "Agendando...") : (initialData ? "Atualizar Aula" : "Agendar Aula")}
        </Button>
      </form>
    </Form>
  );
}
