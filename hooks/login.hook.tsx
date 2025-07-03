import { useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface IProps {
  email: string;
  password: string;
}

export function useLoginUser<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, IProps, unknown>({
    mutationFn: async (props: IProps) => {
      return await axios.post("/user/login", props);
    },
  });
}