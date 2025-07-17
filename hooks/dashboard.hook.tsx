"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxios } from "@/hooks/axios.hook";
import { PaginatedResponse } from "@/hooks/teacher.hook"; // Reutilizando a interface de paginação

// Interfaces específicas para os dados do Dashboard
export interface IDashboardSubject {
  id: string;
  name: string;
  description: string;
}

export interface IDashboardTeacher {
  id: string;
  name: string;
}

export interface IDashboardClass {
  id: string;
  room: string;
  startTime: string;
  subject: IDashboardSubject;
  teacher: IDashboardTeacher;
}

export interface IDashboardTask {
  id: string;
  title: string;
  description: string;
  subject: IDashboardSubject;
  dueDate: string;
}

// Hook para Aulas de Hoje (paginado)
export const useGetDashboardClasses = (page: number = 1, perPage: number = 3) => {
  const api = useAxios();
  return useQuery<PaginatedResponse<IDashboardClass>>({
    queryKey: ["dashboard-classes", page, perPage],
    queryFn: async () => {
      const { data } = await api.get(`/classes/dashboard?page=${page}&perPage=${perPage}`);
      return data.data; // Espera a estrutura { data: { page, perPage, pages, list, total } }
    },
  });
};

// Hook para Próximas Tarefas (paginado, embora o dashboard possa usar apenas os primeiros itens)
export const useGetDashboardUpcomingTasks = (page: number = 1, perPage: number = 4) => {
  const api = useAxios();
  return useQuery<PaginatedResponse<IDashboardTask>>({
    queryKey: ["dashboard-upcoming-tasks", page, perPage],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/upcoming?page=${page}&perPage=${perPage}`);
      return data.data; // Espera a estrutura { data: { page, perPage, pages, list, total } }
    },
  });
};

// Hook para Disciplinas do Semestre (paginado)
export const useGetDashboardSubjects = (page: number = 1, perPage: number = 3) => {
  const api = useAxios();
  return useQuery<PaginatedResponse<IDashboardSubject>>({
    queryKey: ["dashboard-subjects", page, perPage],
    queryFn: async () => {
      const { data } = await api.get(`/subjects?page=${page}&perPage=${perPage}`);
      return data.data; // Espera a estrutura { data: { page, perPage, pages, list, total } }
    },
  });
};
