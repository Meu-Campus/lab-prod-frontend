"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TeacherFormComponent } from "@/components/teacher-form.component";
import { useGetTeachers } from "@/hooks/teacher.hook";
import { Plus, Edit, Trash2, Search } from "lucide-react";
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
import { Teacher, useDeleteTeacher } from "@/hooks/teacher.hook";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Input } from "@/components/ui/input";

export default function TeachersPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: paginatedTeachers, isLoading: isLoadingTeachers } = useGetTeachers(page, perPage, search);
  const teachers = paginatedTeachers?.list;
  const totalPages = paginatedTeachers?.pages || 1;

  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher();

  const handleEditClick = (teacher: Teacher) => {
    
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
  };

  const handleEditSuccess = () => {
    setSelectedTeacher(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    deleteTeacher(id);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Professores</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar professor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => { setSelectedTeacher(null); setIsModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Criar Professor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTeachers ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Nome</TableHead>
                  <TableHead className="text-left">Email</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers?.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(teacher)}>
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
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o professor
                              e removerá seus dados de nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteClick(teacher.id)}>
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" onClick={() => setPage(i + 1)} isActive={page === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTeacher ? "Editar Professor" : "Criar Professor"}</DialogTitle>
          </DialogHeader>
          <TeacherFormComponent
            initialData={selectedTeacher || undefined}
            onSuccess={selectedTeacher ? handleEditSuccess : handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}