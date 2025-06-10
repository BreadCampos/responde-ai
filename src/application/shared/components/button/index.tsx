import * as React from "react";
import {
  Button as ShadcnButton,
  type ButtonProps as ShadcnButtonProps,
} from "@/application/shared/components/ui/button";

export type ButtonProps = ShadcnButtonProps & {
  children?: React.ReactNode;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <ShadcnButton disabled={loading || disabled} {...props}>
      {loading ? (
        <span className="animate-spin mr-2 h-4 w-4 inline-block border-2 border-t-transparent border-current rounded-full" />
      ) : null}
      {children}
    </ShadcnButton>
  );
};
