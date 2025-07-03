import { useAxios } from "@/hooks/axios.hook";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

interface IProps {
  email: string;
}

export function useRecoveryLink<R, E>() {
  const axios = useAxios();

  return useMutation<AxiosResponse<R, any>, AxiosError<E>, IProps, unknown>({
    mutationFn: async (props: IProps) => {
      return await axios.post("/user/recovery-link", props);
    },
  });
}