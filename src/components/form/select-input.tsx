import * as React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SelectOption = {
  value: string | number | boolean | null;
  label: string | number | React.ReactNode | boolean | null;
  disabled?: boolean;
};

// Renomeei 'required' para 'isRequired' por consistência, mas você pode manter como 'required' se preferir.
export interface SelectInputProps
  extends Omit<
    React.ComponentProps<typeof Select>,
    "value" | "onValueChange" | "defaultValue"
  > {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  loading?: boolean;
  isRequired?: boolean | string; // Alterado aqui para corresponder ao TextInput
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  triggerClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
}

export const SelectInput = ({
  name,
  label,
  placeholder,
  description,
  options,
  loading = false,
  isRequired, // Alterado aqui
  rules,
  disabled,
  triggerClassName,
  contentClassName,
  containerClassName,
  ...props
}: SelectInputProps) => {
  const { control } = useFormContext();

  // SUGESTÃO DE MELHORIA APLICADA AQUI
  const validationRules: RegisterOptions = { ...rules };
  if (isRequired && !validationRules.required) {
    validationRules.required =
      typeof isRequired === "string" ? isRequired : "Este campo é obrigatório";
  }

  return (
    <FormField
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel className={cn(fieldState.error && "text-destructive")}>
              {label}
              {isRequired && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
            disabled={disabled || loading}
            {...props}
          >
            <FormControl>
              <SelectTrigger
                ref={field.ref}
                className={cn(
                  "w-full",
                  triggerClassName,
                  fieldState.error && "border-destructive"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn(contentClassName)}>
              {loading ? (
                <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={
                      option.value === null || typeof option.value === "boolean"
                        ? `opt-${String(option.label)}`
                        : `opt-${String(option.value)}`
                    }
                    value={String(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

SelectInput.displayName = "SelectInput";
