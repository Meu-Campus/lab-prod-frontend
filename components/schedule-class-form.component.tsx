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
  FormDescription,
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

import { Checkbox } from "@/components/ui/checkbox";

// Schema for form validation
const formSchema = z.object({
  subjectId: z.string().min(1, "A disciplina é obrigatória."),
  teacherId: z.string().min(1, "O professor é obrigatório."),
  date: z.string().optional(),
  startTime: z.string().optional(),
  room: z.string().min(1, "A sala é obrigatória."),
  isRecurring: z.boolean().default(false).optional(),
  dayOfWeek: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Data-dependent Form Component ---
interface ScheduleClassFormProps {
  initialData?: Class;
  subjects: Subject[];
  teachers: Teacher[];
  onSuccess?: () => void;
}

function ScheduleClassForm({ initialData, subjects, teachers, onSuccess }: ScheduleClassFormProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        date: initialData.startTime ? initialData.startTime.split('T')[0] : "",
        startTime: initialData.startTime ? initialData.startTime.split('T')[1].slice(0, 5) : "",
        room: initialData.room,
        isRecurring: initialData.isRecurring || false,
        dayOfWeek: initialData.dayOfWeek ? Number(initialData.dayOfWeek) : undefined,
      }
      : {
        subjectId: "",
        teacherId: "",
        date: "",
        startTime: "",
        room: "",
        isRecurring: false,
        dayOfWeek: undefined,
      },
  });

  const isRecurring = form.watch("isRecurring");

  const { mutate: scheduleClass, isPending: isScheduling } = useScheduleClass(() => {
    form.reset();
    onSuccess?.();
  });
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass(() => {
    onSuccess?.();
  });

  const isPending = isScheduling || isUpdating;

  function onSubmit(values: FormValues) {
    let dataToSend: any = {
      subjectId: values.subjectId,
      teacherId: values.teacherId,
      room: values.room,
      isRecurring: values.isRecurring,
    };

    if (values.isRecurring) {
      // For recurring classes
      dataToSend.dayOfWeek = values.dayOfWeek; // Enviando como string, conforme erro do backend
      dataToSend.startTime = values.startTime; // This is already "HH:MM" from the input
      // Do not send 'date' for recurring classes
    } else {
      // For non-recurring classes
      if (values.date && values.startTime) {
        try {
          const fullIsoString = new Date(`${values.date}T${values.startTime}`).toISOString();
          dataToSend.date = fullIsoString; // 'date' now also contains the full ISO string
          dataToSend.startTime = fullIsoString; // 'startTime' is also the full ISO string
        } catch (e) {
          console.error("Invalid date/time format for non-recurring class", e);
          dataToSend.date = undefined;
          dataToSend.startTime = undefined;
        }
      } else {
        dataToSend.date = undefined;
        dataToSend.startTime = undefined;
      }
      // Do not send 'dayOfWeek' for non-recurring classes
    }

    if (initialData) {
      updateClass({ id: initialData.id, ...dataToSend });
    } else {
      scheduleClass(dataToSend);
    }
  }

  useEffect(() => {
    if (initialData) {
      form.reset({
        subjectId: initialData.subjectId,
        teacherId: initialData.teacherId,
        date: initialData.startTime ? initialData.startTime.split('T')[0] : "",
        startTime: initialData.startTime ? initialData.startTime.split('T')[1].slice(0, 5) : "",
        room: initialData.room,
        isRecurring: initialData.isRecurring || false,
        dayOfWeek: initialData.dayOfWeek ? Number(initialData.dayOfWeek) : undefined,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject and Teacher fields remain the same */}
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disciplina</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
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
          name="isRecurring"
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
                  Aula Periódica
                </FormLabel>
                <FormDescription>
                  Marque se esta aula se repete semanalmente.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {isRecurring ? (
          <>
            {/* Fields for Recurring classes */}
            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia da semana" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Segunda-feira</SelectItem>
                      <SelectItem value="2">Terça-feira</SelectItem>
                      <SelectItem value="3">Quarta-feira</SelectItem>
                      <SelectItem value="4">Quinta-feira</SelectItem>
                      <SelectItem value="5">Sexta-feira</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                      <SelectItem value="7">Domingo</SelectItem>
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
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            {/* Fields for Non-Recurring classes */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
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
                    <Input type="time" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {/* Room and Submit button remain the same */}
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
