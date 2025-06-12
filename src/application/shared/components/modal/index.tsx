import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/application/shared/components/ui/dialog";
import {
  Button,
  type ButtonProps,
} from "@/application/shared/components/button";
import { cn } from "@/application/shared/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  title: string;
  loading?: boolean;

  hideCloseModal?: boolean;
  hideCancel?: boolean;
  description?: string;
  hiddenActions?: boolean;
  className?: string;
  primaryButton?: ButtonProps & { title?: string };
  secondaryButton?: ButtonProps & { title?: string };
};

export const Modal = ({
  open,
  onClose,
  children,
  className,
  title,
  loading,
  hideCloseModal,
  description,
  secondaryButton,
  primaryButton,

  hideCancel,
  hiddenActions,
}: Props) => (
  <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent className={cn("flex flex-col w-fit", className)}>
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-6 -mr-6">{children}</div>
        {!hiddenActions && (
          <DialogFooter>
            {!hideCancel && (
              <Button
                variant="outline"
                onClick={secondaryButton?.onClick || onClose}
                disabled={secondaryButton?.disabled || loading}
              >
                {secondaryButton?.title || "Cancelar"}
              </Button>
            )}
            {primaryButton && (
              <Button
                onClick={primaryButton?.onClick}
                disabled={primaryButton?.disabled || loading}
                loading={loading}
              >
                {primaryButton?.title}
              </Button>
            )}
          </DialogFooter>
        )}
        {!hideCloseModal && <DialogClose asChild />}
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export default Modal;
