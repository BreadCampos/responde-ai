import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authenticationApi } from "../api";
import { httpClient } from "@/core/api/fetch-api";
import { useAuthStore } from "../store/use-auth.store";
import type { LoginEntity } from "../entities/login.entities";

type ResponseType =
  | {
      accessToken: string;
    }
  | undefined;

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginEntity): Promise<ResponseType> => {
      const res = await httpClient.request<ResponseType>({
        method: "POST",
        url: authenticationApi.LOGIN,
        body: data,
      });
      return res.data;
    },
    onSuccess: (token) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      if (token?.accessToken) {
        setTokens({ accessToken: token.accessToken, refreshToken: "" });
      }
    },
  });
};
