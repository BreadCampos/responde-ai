import { useMutation, useQueryClient } from "@tanstack/react-query";

import { companyApi } from "../api";
import type { CreateCompanyModel } from "../model/create-company.model";
import { httpClient } from "@/core/api/fetch-api";
import type { CompanyModel } from "../model/company.mode";

export const useCreateCompanyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (company: CreateCompanyModel) => {
      const response = await httpClient.request<CompanyModel>({
        method: "POST",
        url: companyApi.CREATE_COMPANY,
        body: company,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
