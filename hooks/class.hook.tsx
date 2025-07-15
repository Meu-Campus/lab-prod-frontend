"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/axios.hook";
import { toast } from "sonner";
import { PaginatedResponse } from "@/hooks/teacher.hook";
import { Teacher } from "@/hooks/teacher.hook";

interface ScheduleClassDto {
  subjectId: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Class {
  id: string;
  startTime: string;
  endTime: string;
  room: string;
  teacher: Teacher;
  subject: Subject;
  teacherId: string;
  subjectId: string;
}

interface UpdateClassDto {
  id: string;
  subjectId?: string;
  teacherId?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export function useScheduleClass(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleClassDto) => {
      return api.post("/classes", data);
    },
    onSuccess: () => {
      toast.success("Aula agendada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao agendar a aula.");
    },
  });
}

export function useUpdateClass(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClassDto) => {
      return api.put(`/classes?id=${data.id}`, data);
    },
    onSuccess: () => {
      toast.success("Aula atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao atualizar a aula.");
    },
  });
}

export function useGetClasses(page: number = 1, perPage: number = 10, search: string = "") {
  const api = useAxios();

  return useQuery<PaginatedResponse<Class>>({
    queryKey: ["classes", page, perPage, search],
    queryFn: async () => {
      let url = `/classes?page=${page}&perPage=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      const response = await api.get(url);
      return response.data.data;
    },
  });
}

export function useDeleteClass() {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/classes?id=${id}`);
    },
    onSuccess: () => {
      toast.success("Aula deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao deletar a aula.");
    },
  });
}
