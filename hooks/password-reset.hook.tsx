import { useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface IProps {
  password: string;
  email: string;
  token: string;
}

export function usePasswordReset<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, IProps, unknown>({
    mutationFn: async (props: IProps) => {
      return await axios.post("/user/reset-password", props);
    },
  });
}