import axios from 'axios'

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