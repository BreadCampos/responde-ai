import { TextInput } from "@/application/shared/components/form";

export const RegisterUser = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">1. Seus Dados</h3>
      <TextInput name="user.firstName" label="Nome" />
      <TextInput name="user.lastName" label="Sobrenome" />
      <TextInput name="user.email" label="E-mail" type="email" />
      <TextInput name="user.password" label="Senha" type="password" />
      <TextInput
        name="user.passwordConfirmation"
        label="Confirme a Senha"
        type="password"
      />
    </div>
  );
};
