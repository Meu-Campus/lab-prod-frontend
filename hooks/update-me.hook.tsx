import { useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

export function useUpdateMe<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, FormData, unknown>({
    mutationFn: async (props: FormData) => {
      return await axios.put("/user/me", props);
    },
  });
}