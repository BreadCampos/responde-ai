import { useMutation } from "@tanstack/react-query";
import type { RegisterModel } from "../model/register.model";
import { httpClient } from "@/core/api/fetch-api";
import { useAuthStore } from "../store/use-auth.store";
import { authenticationApi } from "../api";
import { toast } from "sonner";

type ReponseType =
  | {
      token: string;
    }
  | undefined;

export const useRegisterMutation = () => {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterModel): Promise<ReponseType> => {
      const res = await httpClient.request<ReponseType>({
        method: "POST",
        url: authenticationApi.REGISTER,
        body: data,
      });
      return res.data;
    },
    onSuccess: async (token) => {
      if (token?.token) {
        await setTokens({ accessToken: token.token, refreshToken: "" });
        toast.success("Cadastro realizado com sucesso");
      }
    },
  });
};
