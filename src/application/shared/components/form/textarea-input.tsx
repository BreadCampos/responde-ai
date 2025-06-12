import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/application/shared/lib/utils";
import {
  Textarea,
  type TextareaProps,
} from "@/application/shared/components/ui/textarea";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/application/shared/components/ui/form";

export interface TextareaInputProps
  extends Omit<TextareaProps, "name" | "value" | "onChange"> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  containerClassName?: string;
}

export const TextareaInput = ({
  name,
  label,
  description,
  required,
  rules,
  containerClassName,
  ...props
}: TextareaInputProps) => {
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
          className={cn("w-full text-card-foreground", containerClassName)}
        >
          {label && (
            <FormLabel
              htmlFor={name}
              className={cn(fieldState.error && "text-destructive")}
            >
              {label}
              {required && <span className="ml-0.5 text-destructive">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <Textarea
              id={name}
              className={cn(
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...props}
              {...field}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

TextareaInput.displayName = "TextareaInput";
