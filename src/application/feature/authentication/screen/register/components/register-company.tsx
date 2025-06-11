import { CheckboxInput, TextInput } from "@/application/shared/components/form";
import { MaskedInput } from "@/application/shared/components/form/mask-input";

export const RegisterCompany = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">2. Dados da Empresa</h3>
      <TextInput name="company.legalName" label="Razão Social" />
      <TextInput name="company.fantasyName" label="Nome Fantasia" />
      <MaskedInput
        name="company.document"
        label="Documento (CNPJ)"
        mask={"00.000.000/0000-00"}
      />
      <TextInput name="company.addressLine" label="Endereço" />
      <TextInput name="company.logoUrl" label="URL do Logo" />
      <TextInput
        name="company.theme.primary"
        label="Cor Primária do Tema"
        type="color"
      />
      <CheckboxInput
        name="company.settings.always_display_logo"
        label="Sempre Mostrar logo "
      />
    </div>
  );
};
