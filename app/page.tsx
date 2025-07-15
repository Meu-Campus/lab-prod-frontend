"use client";

import { HeaderComponent } from "@/components/header-component";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Plus, UserPlus } from "lucide-react";
import { SubjectComponent } from "@/components/subject.component";
import { TeacherFormComponent } from "@/components/teacher-form.component";
import { ScheduleClassFormComponent } from "@/components/schedule-class-form.component";
import { TaskFormComponent } from "@/components/task-form.component";
import { useGetClasses } from "@/hooks/class.hook";
import { useGetMeInfo } from "@/hooks/me-info.hook";
import { useGetTasks } from "@/hooks/task.hook";
import { useGetSubjects } from "@/hooks/subject.hook";
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {
  const { data: me, isLoading: isLoadingMe } = useGetMeInfo();
  const { data: classes, isLoading: isLoadingClasses } = useGetClasses();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  return (
    <div className="min-h-screen w-full">
      
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-2xl text-black mb-2">Bem-vindo de volta, {isLoadingMe ? <Skeleton className="h-8 w-32 inline-block" /> : me?.name}</h1>
        <p className="text-neutral-600 mb-6">
          Aqui está um resumo do seu dia acadêmico
        </p>


        <div className="grid grid-cols-3 gap-6">
          {/* Aulas de Hoje */}
          <Card className="col-span-2">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Aulas de Hoje <span
                className="text-sm text-muted-foreground float-right">Quinta-feira, 15 de Janeiro</span>
              </h2>
              <div className="space-y-3">
                {isLoadingClasses ? (
                  <div className="space-y-3">
                    <Skeleton className="h-[100px] w-full"/>
                    <Skeleton className="h-[100px] w-full"/>
                    <Skeleton className="h-[100px] w-full"/>
                  </div>
                ) : classes?.length ? (
                  classes.map((aula, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="font-medium">{aula.subject.name}</div>
                        <div className="text-sm text-muted-foreground">{aula.teacher.name}</div>
                        <div className="text-sm">{new Date(aula.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(aula.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</div>
                        <div className="text-sm">{aula.room}</div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Nenhuma aula para hoje.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Tarefas + Calendário */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Próximas Tarefas <span
                  className="float-right text-sm text-blue-600 cursor-pointer">Ver todas</span></h2>
                <ul className="list-disc pl-4 text-sm space-y-2">
                  {isLoadingTasks ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full"/>
                      <Skeleton className="h-4 w-full"/>
                      <Skeleton className="h-4 w-full"/>
                      <Skeleton className="h-4 w-full"/>
                    </div>
                  ) : tasks?.length ? (
                    tasks.map((task, i) => (
                      <li key={i}>
                        <strong>{task.title}</strong><br/>{task.subject.name} - {new Date(task.dueDate).toLocaleDateString()}
                      </li>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">Nenhuma tarefa próxima.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Janeiro 2025</h2>
                <Calendar mode="single" selected={new Date(2025, 0, 15)} className="rounded-md border"/>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disciplinas do Semestre */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Disciplinas do Semestre</h2>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {isLoadingSubjects ? (
                  <>
                    <Skeleton className="h-[100px] w-full"/>
                    <Skeleton className="h-[100px] w-full"/>
                    <Skeleton className="h-[100px] w-full"/>
                  </>
                ) : subjects?.length ? (
                  subjects.map((subject, i) => (
                    <div className="border rounded p-4" key={i}>
                      <strong>{subject.name}</strong><br/>
                      {subject.description}<br/>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground col-span-3">Nenhuma disciplina cadastrada.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8"/>
        <footer className="text-center text-sm text-muted-foreground mb-4">
          © 2025 Meu Campus. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}












