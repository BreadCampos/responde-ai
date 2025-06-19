import { Button } from "@/shared/components/button";
import { TextInput } from "@/shared/components/form";
import { Form } from "@/shared/components/ui/form";
import { useToggle } from "@/shared/hooks/use-toggle";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginResolver, type LoginFormValues } from "./login.schema";
import { useLoginMutation } from "../../service/login.mutation";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/core/routes/route-constants";

export const LoginScreen = () => {
  const methods = useForm<LoginFormValues>({
    resolver: loginResolver,
  });

  const [showPassword, setShowPassword] = useToggle();

  const navigate = useRouter();
  const redirectToRegister = () => {
    navigate.push(ROUTES.REGISTER);
  };

  const login = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    login.mutateAsync(data);
  };

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">Login</h1>
          <p className="text-sm text-muted-foreground">
            Por favor, insira suas credenciais para fazer login.
          </p>
        </div>
        <div className="space-y-4">
          <TextInput
            name={"email"}
            placeholder="john.doe@addres.com"
            label={"Email"}
            autoFocus
            required
            type="email"
          />

          <TextInput
            name={"password"}
            placeholder="********"
            autoComplete="current-password"
            label={"Senha"}
            type={showPassword ? "text" : "password"}
            required
            symbol={
              <Button
                onClick={setShowPassword}
                variant={"ghost"}
                type="button"
                autoFocus={false}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </Button>
            }
          />
          <Button type="button" variant={"link"} disabled>
            Esqueci minha Senha
          </Button>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <Button type="button" variant={"link"} onClick={redirectToRegister}>
            Criar Conta
          </Button>
        </div>
      </form>
    </Form>
  );
};
