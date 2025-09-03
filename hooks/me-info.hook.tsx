import { useAxios } from "@/hooks/axios.hook";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export type MeInfo = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function useGetMeInfo(enabled: boolean = true) {
  const api = useAxios();

  return useQuery<MeInfo, AxiosError>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/user/me");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled, // só executa se for true
  });
}
