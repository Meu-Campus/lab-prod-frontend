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
import { useGetAllTeachers, Teacher } from "@/hooks/teacher.hook";
import { useGetAllSubjects, Subject } from "@/hooks/subject.hook";
import { useScheduleClass, useUpdateClass, Class } from "@/hooks/class.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

// Schema for form validation
const formSchema = z.object({
  subjectId: z.string().min(1, "A disciplina é obrigatória."),
  teacherId: z.string().min(1, "O professor é obrigatório."),
  startTime: z.string().min(1, "O horário de início é obrigatório."),
  endTime: z.string().min(1, "O horário de fim é obrigatório."),
  room: z.string().min(1, "A sala é obrigatória."),
});

type FormValues = z.infer<typeof formSchema>;

// --- Data-dependent Form Component ---
// This component is only rendered when all its data dependencies are met.
// This prevents the race condition that was causing the issue.

interface ScheduleClassFormProps {
  initialData?: Class;
  subjects: Subject[];
  teachers: Teacher[];
  onSuccess?: () => void;
}

function ScheduleClassForm({ initialData, subjects, teachers, onSuccess }: ScheduleClassFormProps) {
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // Set defaultValues directly. This is now safe because this component
    // is not rendered until `subjects` and `teachers` are loaded.
    defaultValues: initialData
      ? {
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        startTime: initialData.startTime.slice(0, 16),
        endTime: initialData.endTime.slice(0, 16),
        room: initialData.room,
      }
      : {
        subjectId: "",
        teacherId: "",
        startTime: "",
        endTime: "",
        room: "",
      },
  });

  const { mutate: scheduleClass, isPending: isScheduling } = useScheduleClass(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass(() => {
    onSuccess?.();
  });

  const isPending = isScheduling || isUpdating;

  function onSubmit(values: FormValues) {
    if (initialData) {
      updateClass({ id: initialData.id, ...values });
    } else {
      scheduleClass(values);
    }
  }

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        startTime: initialData.startTime.slice(0, 16),
        endTime: initialData.endTime.slice(0, 16),
        room: initialData.room,
      });
    }
  }, [initialData]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina"/>
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
              <FormMessage/>
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
                    <SelectValue placeholder="Selecione o professor"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
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
              <FormMessage/>
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
              <FormMessage/>
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
              <FormMessage/>
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
interface ScheduleClassFormComponentProps {
  initialData?: Class;
  onSuccess?: () => void;
}

export function ScheduleClassFormComponent({ initialData, onSuccess }: ScheduleClassFormComponentProps) {
  const { data: teachers, isLoading: isLoadingTeachers } = useGetAllTeachers();
  const { data: subjects, isLoading: isLoadingSubjects } = useGetAllSubjects();

  const isLoading = isLoadingSubjects || isLoadingTeachers;

  // Show skeleton until both subjects and teachers are loaded.
  if (isLoading) {
    return <FormSkeleton/>;
  }

  // Render the actual form only when data is available, passing it as props.
  return (
    <ScheduleClassForm
      initialData={initialData}
      subjects={subjects || []}
      teachers={teachers || []}
      onSuccess={onSuccess}
    />
  );
}