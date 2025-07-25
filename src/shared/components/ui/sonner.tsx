import { Ban, Check, Info, LoaderIcon, ShieldAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        className: "toaster group",

        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",

          // Definição de cores específicas por tipo de toast
          success:
            "group toast group-[.toaster]:bg-success group-[.toaster]:text-success-foreground",
          error:
            "group toast group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
          warning:
            "group toast group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground",
          info: "group toast group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
        },

        closeButton: true,
        closeButtonAriaLabel: "Fechar notificação",
        duration: 5000,
      }}
      icons={{
        success: <Check color="green" />,
        info: <Info color="warning" />,
        warning: <ShieldAlert />,
        error: <Ban />,
        loading: <LoaderIcon className="animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
