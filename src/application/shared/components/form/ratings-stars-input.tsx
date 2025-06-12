import { useState } from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { Star } from "lucide-react";
import { cn } from "@/application/shared/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/application/shared/components/ui/form";

export interface RatingStarsInputProps {
  name: string;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  containerClassName?: string;
}

export const RatingStarsInput = ({
  name,
  label,
  description,
  min = 1,
  max = 5,
  required,
  rules,
  containerClassName,
}: RatingStarsInputProps) => {
  const { control } = useFormContext();
  const [hoverValue, setHoverValue] = useState<number | null>(null);

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
            <div className="flex items-center gap-1">
              {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(
                (starValue) => (
                  <Star
                    key={starValue}
                    size={32}
                    className={`cursor-pointer transition-colors ${
                      (hoverValue || field.value) >= starValue
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill={
                      (hoverValue || field.value) >= starValue
                        ? "currentColor"
                        : "none"
                    }
                    onMouseEnter={() => setHoverValue(starValue)}
                    onMouseLeave={() => setHoverValue(null)}
                    // Aqui usamos o field.onChange diretamente
                    onClick={() => field.onChange(starValue)}
                  />
                )
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

RatingStarsInput.displayName = "RatingStarsInput";
