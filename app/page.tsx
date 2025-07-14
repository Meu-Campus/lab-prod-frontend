"use client";

import { HeaderComponent } from "@/components/header-component";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Plus, UserPlus } from "lucide-react";
import { SubjectComponent } from "@/components/subject.component";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeaderComponent loggedIn={true}/>
      <div className="container mx-auto px-4 pt-8">
        <h1 className="text-2xl text-black mb-2">Bem-vindo de volta, João!</h1>
        <p className="text-neutral-600 mb-6">
          Aqui está um resumo do seu dia acadêmico
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4"/> Adicionar Disciplina</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Disciplina</DialogTitle>
              </DialogHeader>
              <SubjectComponent/>
            </DialogContent>
          </Dialog>

          <Button variant="outline"><CalendarDays className="mr-2 h-4 w-4"/> Agendar Aula</Button>
          <Button variant="outline"><Plus className="mr-2 h-4 w-4"/> Nova Tarefa</Button>
          <Button variant="outline"><UserPlus className="mr-2 h-4 w-4"/> Adicionar Professor</Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Aulas de Hoje */}
          <Card className="col-span-2">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                Aulas de Hoje <span
                className="text-sm text-muted-foreground float-right">Quinta-feira, 15 de Janeiro</span>
              </h2>
              <div className="space-y-3">
                {[
                  { title: "Cálculo I", prof: "Prof. Maria Santos", horario: "08:00 - 10:00", sala: "Sala 201" },
                  { title: "Física I", prof: "Prof. João Oliveira", horario: "14:00 - 16:00", sala: "Lab 103" },
                  { title: "Programação", prof: "Prof. Ana Costa", horario: "19:00 - 21:00", sala: "Lab 205" }
                ].map((aula, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="font-medium">{aula.title}</div>
                      <div className="text-sm text-muted-foreground">{aula.prof}</div>
                      <div className="text-sm">{aula.horario}</div>
                      <div className="text-sm">{aula.sala}</div>
                    </CardContent>
                  </Card>
                ))}
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
                  <li><strong>Entrega do Projeto Final</strong><br/>Programação - Amanhã</li>
                  <li><strong>Ler Capítulo 3 – Derivadas</strong><br/>Cálculo I - 18 Jan</li>
                  <li><strong>Exercícios Lista 2</strong><br/>Física I - 20 Jan</li>
                  <li><strong>Prova Parcial</strong><br/>Cálculo I - 25 Jan</li>
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
                <div className="border rounded p-4">
                  <strong>Cálculo I</strong><br/>
                  Prof. Maria Santos<br/>
                  maria.santos@universidade.edu<br/>
                  <span className="inline-block mt-2">Seg 08:00<br/>Qui 08:00</span>
                </div>
                <div className="border rounded p-4">
                  <strong>Física I</strong><br/>
                  Prof. João Oliveira<br/>
                  joao.oliveira@universidade.edu<br/>
                  <span className="inline-block mt-2">Ter 14:00<br/>Qui 14:00</span>
                </div>
                <div className="border rounded p-4">
                  <strong>Programação</strong><br/>
                  Prof. Ana Costa<br/>
                  ana.costa@universidade.edu<br/>
                  <span className="inline-block mt-2">Qui 19:00<br/>Sex 19:00</span>
                </div>
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
