import { Button } from "@/application/shared/components/button";
import { TextInput } from "@/application/shared/components/form";
import { Form } from "@/application/shared/components/ui/form";
import { useToggle } from "@/application/shared/hooks/use-toggle";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";

export const LoginScreen = () => {
  const methods = useForm({});
  const [showPassword, setShowPassword] = useToggle();

  const onSubmit = (data: any) => {
    console.log("Form submitted with data:", data);
    // Handle login logic here};
  };
  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-card-foreground">
            Login Screen
          </h1>
          <p className="text-sm text-muted-foreground">
            Por favor, insira suas credenciais para fazer login.
          </p>
        </div>
        <div className="space-y-4">
          <TextInput
            name={"login"}
            placeholder="john.doe@addres.com"
            label={"Login"}
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
              <Button onClick={setShowPassword} variant={"ghost"} type="button">
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </Button>
            }
          />
          <Button type="button" variant={"link"}>
            Esqueci minha Senha
          </Button>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <Button type="button" variant={"link"}>
            Criar Conta
          </Button>
        </div>
      </form>
    </Form>
  );
};
