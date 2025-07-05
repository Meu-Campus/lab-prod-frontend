import { useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export type MeInfo = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useMeInfo<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, any, unknown>({
    mutationFn: async () => {
      return (await axios.get("/user/me")).data;
    },
  });
}