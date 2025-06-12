import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authenticationApi } from "../api";
import { httpClient } from "@/core/api/fetch-api";
import { useAuthStore } from "../store/use-auth.store";
import type { LoginEntity } from "../entities/login.entities";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/core/routes/route-constants";
import type { UserModel } from "../model/user.model";

type ResponseType =
  | {
      token: string;
      user: UserModel;
    }
  | undefined;

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  const { setTokens, setUser } = useAuthStore();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginEntity): Promise<ResponseType> => {
      const res = await httpClient.request<ResponseType>({
        method: "POST",
        url: authenticationApi.LOGIN,
        body: data,
      });
      return res.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      if (response?.token) {
        setTokens({ accessToken: response.token, refreshToken: "" });
        setUser({ user: response?.user });
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Handle error appropriately, e.g., show a notification or alert
    },
  });
};
