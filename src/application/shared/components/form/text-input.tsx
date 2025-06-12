import type { ReactNode } from "react";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { cn } from "@/application/shared/lib/utils";
import {
  Input,
  type InputProps,
} from "@/application/shared/components/ui/input";
import { Label } from "@/application/shared/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/application/shared/components/ui/tooltip";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/application/shared/components/ui/form";
import { Info } from "lucide-react";

export type TextInputProps = Omit<InputProps, "name"> & {
  name: string;
  label?: string;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  tooltip?: string;
  symbol?: string | ReactNode;
  symbolLeft?: boolean;
  optional?: boolean;
  isLabelBold?: boolean;
  badge?: ReactNode;
  isLabelColorPrimary?: boolean;
  helperText?: ReactNode;
  containerClassName?: string;
};

export const TextInput = ({
  name,
  label,
  required,
  rules,
  tooltip,
  optional,
  isLabelBold,
  isLabelColorPrimary,
  badge,
  helperText,
  symbol,
  symbolLeft,
  containerClassName,
  onChange,
  ...inputProps
}: TextInputProps) => {
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
        <div
          className={cn(
            "w-full space-y-1 text-card-foreground text-card-foreground",
            containerClassName
          )}
        >
          <FormItem>
            {label && (
              <div className="flex items-center gap-1">
                <Label
                  htmlFor={inputProps.id || name}
                  className={cn(
                    "text-card-foreground",
                    isLabelBold && "font-bold",
                    isLabelColorPrimary && "text-primary",
                    fieldState.error && "text-destructive"
                  )}
                >
                  {label}
                  {required && (
                    <span className="ml-0.5 text-destructive">*</span>
                  )}
                  {badge}
                  {optional && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      (opcional)
                    </span>
                  )}
                </Label>
                {tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1 cursor-pointer">
                          <Info size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
            <div
              className={cn(
                "relative flex items-center",
                symbolLeft && "flex-row-reverse"
              )}
            >
              {symbol && (
                <span
                  className={cn(
                    "absolute px-2 text-muted-foreground",
                    symbolLeft ? "left-2" : "right-2"
                  )}
                >
                  {symbol}
                </span>
              )}
              <FormControl>
                <Input
                  id={inputProps.id || name}
                  className={cn(
                    inputProps.className,
                    symbol && (symbolLeft ? "pl-8" : "pr-8"),
                    fieldState.error &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                  {...inputProps}
                  {...field}
                  onChange={(e) => {
                    if (onChange) {
                      onChange(e);
                    }
                    field.onChange(e);
                  }}
                />
              </FormControl>
            </div>
            {helperText && (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            )}
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
};

TextInput.displayName = "TextInput";
