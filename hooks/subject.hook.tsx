"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/axios.hook";
import { toast } from "sonner";

import { PaginatedResponse } from "@/hooks/teacher.hook";

interface CreateSubjectDto {
  name: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

interface UpdateSubjectDto {
  id: string;
  name?: string;
  description?: string;
}

export function useCreateSubject(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectDto) => {
      return api.post("/subjects", data);
    },
    onSuccess: () => {
      toast.success("Disciplina criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao criar a disciplina.");
    },
  });
}

export function useUpdateSubject(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubjectDto) => {
      return api.put(`/subjects?id=${data.id}`, data);
    },
    onSuccess: () => {
      toast.success("Disciplina atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao atualizar a disciplina.");
    },
  });
}

export function useGetSubjects(page: number = 1, perPage: number = 10, search: string = "") {
  const api = useAxios();

  return useQuery<PaginatedResponse<Subject>>({
    queryKey: ["subjects", page, perPage, search],
    queryFn: async () => {
      let url = `/subjects?page=${page}&perPage=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      const response = await api.get(url);
      return response.data.data;
    },
  });
}

export function useDeleteSubject() {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/subjects?id=${id}`);
    },
    onSuccess: () => {
      toast.success("Disciplina deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao deletar a disciplina.");
    },
  });
}

export function useGetAllSubjects() {
  const api = useAxios();

  return useQuery<Subject[]>({ 
    queryKey: ["allSubjects"],
    queryFn: async () => {
      const response = await api.get("/subjects/all");
      return response.data.data;
    },
  });
}
