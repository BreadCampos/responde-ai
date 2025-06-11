import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const signupWithCompanySchema = z
  .object({
    user: z.object({
      firstName: z.string({ message: "O nome é obrigatório." }),
      lastName: z.string({ message: "O sobrenome é obrigatório." }),
      email: z
        .string({ message: "O e-mail é obrigatório." })
        .email({ message: "Insira um e-mail válido." }),
      password: z
        .string({ message: "A senha é obrigatória." })
        .min(8, { message: "A senha precisa de no mínimo 8 caracteres." }),
      passwordConfirmation: z
        .string({ message: "A confirmação de senha é obrigatória." })
        .min(8, { message: "Confirme sua senha." }),
    }),
    company: z.object({
      legalName: z.string({ message: "A razão social é obrigatória." }),
      fantasyName: z.string({ message: "O nome fantasia é obrigatório." }),
      document: z
        .string({ message: "O documento é obrigatório." })
        .min(18, "O CNPJ deve conter 14 dígitos."),
      logoUrl: z
        .string({ message: "A URL do logo é obrigatória." })
        .url({ message: "Insira uma URL válida para o logo." })
        .optional()
        .or(z.literal("")),
      addressLine: z
        .string({ message: "O endereço é obrigatório" })
        .min(10, { message: "O endereço muito curto." }),
      theme: z.object({
        primary: z.string().startsWith("#", {
          message: "A cor deve ser um código hexadecimal.",
        }),
      }),
      settings: z
        .object({
          always_display_logo: z.boolean().default(true).optional(),
        })
        .optional(),
    }),
  })
  .refine((data) => data.user.password === data.user.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["user", "passwordConfirmation"],
  });

export type SignupWithCompanyFormValues = z.infer<
  typeof signupWithCompanySchema
>;

export const signupWithCompanyResolver = zodResolver(signupWithCompanySchema);
