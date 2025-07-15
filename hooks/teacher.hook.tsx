"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/axios.hook";
import { toast } from "sonner";

interface CreateTeacherDto {
  name: string;
  email: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface UpdateTeacherDto {
  id: string;
  name?: string;
  email?: string;
}

export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  total: number;
  pages: number;
  list: T[];
}

export function useCreateTeacher(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherDto) => {
      return api.post("/teachers", data);
    },
    onSuccess: () => {
      toast.success("Professor criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao criar o professor.");
    },
  });
}

export function useUpdateTeacher(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherDto) => {
      return api.put(`/teachers?id=${data.id}`, data);
    },
    onSuccess: () => {
      toast.success("Professor atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao atualizar o professor.");
    },
  });
}

export function useDeleteTeacher(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/teachers?id=${id}`);
    },
    onSuccess: () => {
      toast.success("Professor excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao excluir o professor.");
    },
  });
}

export function useGetTeachers(page: number = 1, perPage: number = 10, search: string = "") {
  const api = useAxios();

  return useQuery<PaginatedResponse<Teacher>>({
    queryKey: ["teachers", page, perPage, search],
    queryFn: async () => {
      let url = `/teachers?page=${page}&perPage=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      const response = await api.get(url);
      return response.data.data;
    },
  });
}

export function useGetAllTeachers() {
  const api = useAxios();

  return useQuery<Teacher[]>({ 
    queryKey: ["allTeachers"],
    queryFn: async () => {
      const response = await api.get("/teachers/all");
      return response.data.data;
    },
  });
}
