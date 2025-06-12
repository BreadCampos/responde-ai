import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/application/shared/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/application/shared/components/ui/form";
import { MultiSelect } from "@/application/shared/components/ui/multiple-select";
import type { SelectOption } from "./select-input";

export interface SelectMultipleInputProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
}

export const SelectMultipleInput = ({
  name,
  label,
  options,
  placeholder,
  required,
  rules,
}: SelectMultipleInputProps) => {
  const { control } = useFormContext();
  const validationRules: RegisterOptions = { ...rules };
  if (required) {
    validationRules.required = {
      message: "Este campo é obrigatório",
      value: true,
    };
  }

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={[]}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <FormItem className={cn("w-full text-card-foreground")}>
          {label && (
            <FormLabel className={cn(fieldState.error && "text-destructive")}>
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <MultiSelect
              ref={field.ref}
              placeholder={placeholder}
              options={options}
              value={field.value}
              onValueChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
