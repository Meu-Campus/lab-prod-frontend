import axios from 'axios'
import Router from 'next/router'

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