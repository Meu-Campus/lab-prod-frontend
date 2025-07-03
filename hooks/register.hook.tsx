import { ApiHookProps, useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface IProps {
  name: string;
  email: string;
  password: string;
}

export function useRegisterUser<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, IProps, unknown>({
    mutationFn: async (props: IProps) => {
      return await axios.post("/user", props);
    },
  });
}