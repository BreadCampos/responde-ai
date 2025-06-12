import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/application/shared/lib/utils";
import {
  Checkbox,
  type CheckboxProps,
} from "@/application/shared/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/application/shared/components/ui/form";

// Omitimos as props que serão controladas e adicionamos as de validação.
export interface CheckboxInputProps
  extends Omit<CheckboxProps, "name" | "checked" | "onCheckedChange"> {
  name: string;
  label: React.ReactNode;
  description?: string;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  containerClassName?: string;
}

export const CheckboxInput = ({
  name,
  label,
  description,
  required,
  rules,
  containerClassName,
  ...props
}: CheckboxInputProps) => {
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
      rules={validationRules}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 text-card-foreground",
            containerClassName,
            fieldState.error &&
              "border-destructive focus-within:border-destructive"
          )}
        >
          <FormControl>
            <Checkbox
              ref={field.ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
              {...props}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel
              htmlFor={name}
              className={cn(fieldState.error && "text-destructive")}
            >
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

CheckboxInput.displayName = "CheckboxInput";
