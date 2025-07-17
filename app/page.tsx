"use client";

import { HeaderComponent } from "@/components/header-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeInfo } from "@/hooks/me-info.hook";
import { useGetDashboardClasses, useGetDashboardUpcomingTasks, useGetDashboardSubjects } from "@/hooks/dashboard.hook";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [classesPage, setClassesPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1); // Embora não paginado no UI, o hook é paginado
  const [subjectsPage, setSubjectsPage] = useState(1);

  const { data: me, isLoading: isLoadingMe } = useGetMeInfo();
  const { data: paginatedClasses, isLoading: isLoadingClasses } = useGetDashboardClasses(classesPage, 6);
  const { data: paginatedTasks, isLoading: isLoadingTasks } = useGetDashboardUpcomingTasks(tasksPage, 4); // Exibindo 4 tarefas
  const { data: paginatedSubjects, isLoading: isLoadingSubjects } = useGetDashboardSubjects(subjectsPage, 3);

  const classes = paginatedClasses?.list;
  const totalClassesPages = paginatedClasses?.pages || 1;

  const tasks = paginatedTasks?.list;
  // const totalTasksPages = paginatedTasks?.pages || 1; // Não usado para UI de paginação de tarefas

  const subjects = paginatedSubjects?.list;
  const totalSubjectsPages = paginatedSubjects?.pages || 1;

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl text-foreground mb-2">Bem-vindo de volta, {isLoadingMe ? <Skeleton className="h-8 w-32 inline-block" /> : me?.name}</h1>
        <p className="text-muted-foreground mb-4">
          Aqui está um resumo do seu dia acadêmico
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* Aulas de Hoje */}
          <Card className="col-span-2">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Aulas de Hoje</h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setClassesPage(p => Math.max(1, p - 1))}
                    disabled={classesPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{classesPage}/{totalClassesPages}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setClassesPage(p => Math.min(totalClassesPages, p + 1))}
                    disabled={classesPage === totalClassesPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {isLoadingClasses ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[80px] w-full"/>
                    <Skeleton className="h-[80px] w-full"/>
                    <Skeleton className="h-[80px] w-full"/>
                  </div>
                ) : classes?.length ? (
                  classes.map((aula, i) => (
                    <Card key={i}>
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">{aula.subject.name}</div>
                        <div className="text-xs text-muted-foreground">{aula.teacher.name}</div>
                        <div className="text-xs">
                          Horário: {
                            aula.isRecurring ? (
                              aula.startTime
                            ) : (
                              new Date(aula.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'UTC'
                              })
                            )
                          }
                        </div>
                        <div className="text-xs">Sala: {aula.room}</div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-10">Nenhuma aula para hoje.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Tarefas */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-3">
                <h2 className="text-lg font-semibold mb-3">Próximas Tarefas <Link href="/tasks" className="float-right text-sm text-blue-600 cursor-pointer">Ver todas</Link></h2>
                <ul className="list-disc pl-4 text-sm space-y-1">
                  {isLoadingTasks ? (
                    <div className="space-y-1">
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
                    <p className="text-center text-muted-foreground text-sm">Nenhuma tarefa próxima.</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disciplinas do Semestre */}
        <div className="mt-6">
          <Card>
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Disciplinas do Semestre</h2>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSubjectsPage(p => Math.max(1, p - 1))}
                    disabled={subjectsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">{subjectsPage}/{totalSubjectsPages}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSubjectsPage(p => Math.min(totalSubjectsPages, p + 1))}
                    disabled={subjectsPage === totalSubjectsPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {isLoadingSubjects ? (
                  <>
                    <Skeleton className="h-[80px] w-full"/>
                    <Skeleton className="h-[80px] w-full"/>
                    <Skeleton className="h-[80px] w-full"/>
                  </>
                ) : subjects?.length ? (
                  subjects.map((subject, i) => (
                    <div className="border rounded p-3" key={i}>
                      <strong>{subject.name}</strong><br/>
                      {subject.description}<br/>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground col-span-3 text-sm py-10">Nenhuma disciplina cadastrada.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}