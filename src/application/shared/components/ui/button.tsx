import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/application/shared/lib/utils";

const buttonVariants = cva(
  // Classes base, estão boas.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        // Este funciona em ambos os temas, pois as variáveis CSS mudam
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        // Este também funciona, pois 'destructive' e 'destructive-foreground' são um par
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        // Esta é a forma correta para o outline, usando as variáveis que mudam com o tema
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        // O par 'secondary' e 'secondary-foreground' também é feito para funcionar nos dois temas
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        // O 'ghost' já se adapta bem, pois 'accent' e 'accent-foreground' mudam
        ghost: "hover:bg-accent hover:text-accent-foreground",

        // 'link' também se adapta, pois a cor 'primary' muda
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // As classes de tamanho estão corretas
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
