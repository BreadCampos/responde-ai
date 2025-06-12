import React from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/application/shared/lib/utils";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/application/shared/components/ui/radio-group";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/application/shared/components/ui/form";
import { Label } from "@/application/shared/components/ui/label";
import type { SelectOption } from "./select-input";

export interface RadioGroupInputProps
  extends Omit<
    React.ComponentProps<typeof RadioGroup>,
    "name" | "value" | "onValueChange" | "defaultValue"
  > {
  name: string;
  label?: string;
  description?: string;
  options: SelectOption[];
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  containerClassName?: string;
}

export const RadioGroupInput = ({
  name,
  label,
  description,
  options,
  required,
  rules,
  containerClassName,
  ...props
}: RadioGroupInputProps) => {
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
            "space-y-3 text-card-foreground",
            containerClassName,
            fieldState.error && "text-destructive"
          )}
        >
          {label && (
            <FormLabel className={cn(fieldState.error && "text-destructive")}>
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <RadioGroup
              ref={field.ref}
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
              {...props}
            >
              {options.map((option) => (
                <FormItem
                  key={String(option.value)}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem
                      value={String(option.value)}
                      id={`${name}-${String(option.value)}`}
                      disabled={option.disabled}
                    />
                  </FormControl>
                  <Label
                    htmlFor={`${name}-${String(option.value)}`}
                    className="font-normal"
                  >
                    {option.label}
                  </Label>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

RadioGroupInput.displayName = "RadioGroupInput";
