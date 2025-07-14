import axios from 'axios'
import Router from 'next/router'
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  const apiKey = process.env.NEXT_PUBLIC_API_KEY

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (apiKey) {
    config.headers['x-api-key'] = apiKey
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error);
  }
)

export const useAxios = () => api

export type ApiResponse<T> = {
  message: string;
  errors: { key: string; message: string }[];
  data?: T;
}

export type ApiHookProps = {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}


export function useGet<T>(key: string[], url: string, props?: ApiHookProps) {
  const api = useAxios()
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get<ApiResponse<T>>(url)
      return res.data
    },
    gcTime: 0, // ou o tempo que quiser
    retry: false,
    meta: {
      onSuccess: props?.onSuccess,
      onError: props?.onError,
    }
  })
}

// POST
export function usePost<T = any, D = any>(url: string, props?: ApiHookProps) {
  const api = useAxios()
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<T>, any, D>({
    mutationFn: async (data: D) => {
      const res = await api.post(url, data)
      return res.data
    },
    onSuccess: data => {
      props?.onSuccess?.(data)
    },
    onError: props?.onError,
  })
}

// PUT
export function usePut<T = any, D = any>(url: string, props?: ApiHookProps) {
  const api = useAxios()
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<T>, any, D>({
    mutationFn: async (data: D) => {
      const res = await api.put(url, data)
      return res.data
    },
    onSuccess: data => {
      props?.onSuccess?.(data)
    },
    onError: props?.onError,
  })
}

// DELETE
export function useDelete<T = any>(url: string, props?: ApiHookProps) {
  const api = useAxios()
  const queryClient = useQueryClient()
  return useMutation<ApiResponse<T>, any, void>({
    mutationFn: async () => {
      const res = await api.delete(url)
      return res.data
    },
    onSuccess: data => {
      props?.onSuccess?.(data)
    },
    onError: props?.onError,
  })
}