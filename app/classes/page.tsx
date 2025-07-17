"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScheduleClassFormComponent } from "@/components/schedule-class-form.component";
import { useGetClasses, useDeleteClass } from "@/hooks/class.hook";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Class } from "@/hooks/class.hook";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

export default function ClassesPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: paginatedClasses, isLoading: isLoadingClasses } = useGetClasses(page, perPage, search);
  const { mutate: deleteClass } = useDeleteClass();
  const classes = paginatedClasses?.list;
  const totalPages = paginatedClasses?.pages || 1;

  const handleEditClick = (aula: Class) => {
    setSelectedClass(aula);
    setIsModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setSelectedClass(null);
    setIsModalOpen(false);
  };

  const handleEditSuccess = () => {
    setSelectedClass(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Aulas</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => { setSelectedClass(null); setIsModalOpen(true); }}><Plus className="mr-2 h-4 w-4"/> Agendar Aula</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Disciplina</TableHead>
              <TableHead className="text-left">Professor</TableHead>
              <TableHead className="text-left">Sala</TableHead>
              <TableHead className="text-left">Horário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingClasses ? (
              Array.from({ length: perPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : classes?.length ? (
              classes.map((aula) => (
                <TableRow key={aula.id}>
                  <TableCell className="font-medium">{aula.subject.name}</TableCell>
                  <TableCell>{aula.teacher.name}</TableCell>
                  <TableCell>{aula.room}</TableCell>
                  
                  <TableCell>
                    {aula.startTime ? (
                      new Date(aula.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                      })
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(aula)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso irá deletar permanentemente a aula.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteClass(aula.id)}>Deletar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(aula)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso irá deletar permanentemente a aula.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteClass(aula.id)}>Deletar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma aula agendada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClass ? "Editar Aula" : "Agendar Aula"}</DialogTitle>
          </DialogHeader>
          <ScheduleClassFormComponent
            initialData={selectedClass || undefined}
            onSuccess={selectedClass ? handleEditSuccess : handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.max(1, prev - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                disabled={page === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prev) => Math.min(totalPages, prev + 1));
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : undefined}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
