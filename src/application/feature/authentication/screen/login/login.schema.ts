import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const loginSchema = z.object({
  email: z
    .string({ message: "A email é obrigatória." })
    .email({ message: "Por favor, insira um e-mail válido." }),
  password: z
    .string({ message: "A senha é obrigatória." })
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginResolver = zodResolver(loginSchema);
