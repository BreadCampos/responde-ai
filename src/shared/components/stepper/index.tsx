import { Button } from "@/shared/components/button";
import { useTranslation } from "@/shared/hooks/use-translation";
import * as React from "react";
import { cn } from "../../lib/utils";
interface StepperDotsProps {
  totalSteps: number;
  currentStep: number;
}
const StepperDots = ({ totalSteps, currentStep }: StepperDotsProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={`step-dot-${i}`}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            currentStep === i ? "bg-primary w-4" : "bg-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
};

interface StepperProps {
  steps: React.ReactNode[];
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  finalStepButtonText?: string;
  isLoading?: boolean;
}

export const Stepper = ({
  steps,
  currentStep,
  onNextStep,
  onPrevStep,
  finalStepButtonText,
  isLoading = false,
}: StepperProps) => {
  const isLastStep = currentStep === steps.length - 1;

  const { t } = useTranslation("common");

  const buttonText = finalStepButtonText || t("button.next");
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow">{steps[currentStep]}</div>

      <div className="flex items-center justify-between pt-6 mt-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevStep}
          disabled={isLoading}
        >
          {currentStep > 0 ? t("button.back") : t("button.cancel")}
        </Button>

        <StepperDots totalSteps={steps.length} currentStep={currentStep} />

        <div className="flex justify-end">
          {!isLastStep && (
            <Button type="button" onClick={onNextStep} disabled={isLoading}>
              Próximo
            </Button>
          )}

          {isLastStep && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("button.send") : buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
