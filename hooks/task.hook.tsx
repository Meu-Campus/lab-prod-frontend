"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAxios } from "@/hooks/axios.hook";
import { toast } from "sonner";
import { PaginatedResponse } from "@/hooks/teacher.hook";
import { Subject } from "@/hooks/class.hook";

interface CreateTaskDto {
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: Subject;
}

interface UpdateTaskDto {
  id: string;
  subjectId?: string;
  title?: string;
  description?: string;
  dueDate?: string;
}

export function useCreateTask(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDto) => {
      return api.post("/tasks", data);
    },
    onSuccess: () => {
      toast.success("Tarefa criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao criar a tarefa.");
    },
  });
}

export function useUpdateTask(onSuccessCallback?: () => void) {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskDto) => {
      return api.put(`/tasks?id=${data.id}`, data);
    },
    onSuccess: () => {
      toast.success("Tarefa atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao atualizar a tarefa.");
    },
  });
}

export function useGetTasks(page: number = 1, perPage: number = 10, search: string = "") {
  const api = useAxios();

  return useQuery<PaginatedResponse<Task>>({
    queryKey: ["tasks", page, perPage, search],
    queryFn: async () => {
      let url = `/tasks?page=${page}&perPage=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      const response = await api.get(url);
      return response.data.data;
    },
  });
}

export function useDeleteTask() {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`/tasks?id=${id}`);
    },
    onSuccess: () => {
      toast.success("Tarefa deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error: any) => {
      toast.error(error.response.data.message || "Ocorreu um erro ao deletar a tarefa.");
    },
  });
}
