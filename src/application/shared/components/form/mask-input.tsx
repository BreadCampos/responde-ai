/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { ReactNode } from "react";
import {
  useFormContext,
  type RegisterOptions,
  type ControllerRenderProps,
} from "react-hook-form";
import { useIMask } from "react-imask";
import { cn } from "@/application/shared/lib/utils";
import {
  Input,
  type InputProps,
} from "@/application/shared/components/ui/input";
import { Label } from "@/application/shared/components/ui/label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/application/shared/components/ui/form";

interface MaskedInputCoreProps extends InputProps {
  field: ControllerRenderProps<any, any>;
  mask: any;
}

const MaskedInputCore = React.forwardRef<
  HTMLInputElement,
  MaskedInputCoreProps
>(({ field, mask, ...props }, forwardedRef) => {
  const { ref: iMaskRef } = useIMask({
    mask,
    unmask: true,
    onAccept: (value: any) => {
      field.onChange(value);
    },
  });

  const handleRef = React.useCallback(
    (element: HTMLInputElement | null) => {
      field.ref(element);
      iMaskRef.current = element;

      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    },
    [field, iMaskRef, forwardedRef]
  );

  return (
    <Input
      {...props}
      ref={handleRef}
      name={field.name}
      defaultValue={field.value}
    />
  );
});
MaskedInputCore.displayName = "MaskedInputCore";

export type MaskedInputProps = Omit<InputProps, "name"> & {
  name: string;
  label?: string;
  required?: boolean;
  rules?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
  mask: string | any[];
  containerClassName?: string;
  helperText?: ReactNode;
};

export const MaskedInput = ({
  name,
  label,
  required,
  rules,
  mask,
  containerClassName,
  helperText,
  ...inputProps
}: MaskedInputProps) => {
  const { control } = useFormContext();

  const validationRules: RegisterOptions = { ...rules };
  if (required) {
    validationRules.required = {
      message: "Este campo é obrigatório",
      value: true,
    };
  }

  const maskArray =
    typeof mask === "string" ? mask.split(",").map((m) => m.trim()) : mask;
  const finalMask =
    maskArray.length === 1 ? maskArray[0] : maskArray.map((m) => ({ mask: m }));

  return (
    <FormField
      control={control}
      name={name}
      rules={validationRules}
      render={({ field, fieldState }) => (
        <div className={cn("w-full space-y-1", containerClassName)}>
          <FormItem>
            {label && (
              <Label
                htmlFor={name}
                className={cn(fieldState.error && "text-destructive")}
              >
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
              </Label>
            )}
            <FormControl>
              <MaskedInputCore
                field={field}
                mask={finalMask}
                className={cn(
                  fieldState.error &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                {...inputProps}
              />
            </FormControl>
            {helperText && <FormMessage>{helperText}</FormMessage>}
            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
};

MaskedInput.displayName = "MaskedInput";
