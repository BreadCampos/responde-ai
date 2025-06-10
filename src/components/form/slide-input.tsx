import type { SurveyQuestion } from "@/survey-form/type/survey";
import { Label } from "@radix-ui/react-label";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  rules?: Record<string, unknown>;
  question: SurveyQuestion;
}
export const SlideInput = ({ name, question, rules }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={question?.ratingOptions?.min}
      render={({ field, fieldState: { error } }) => (
        <div className="form-control w-full ">
          {question.label && (
            <Label className={error ? "text-destructive" : ""}>
              {question.label}
            </Label>
          )}
          <div className="flex items-center gap-4 mt-2 ">
            <span>{question.ratingOptions?.min}</span>
            <input
              className="w-full"
              type="range"
              min={question.ratingOptions?.min || 0}
              max={question.ratingOptions?.max || 10}
              ref={field.ref}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <span>{question.ratingOptions?.max}</span>
            <span className="font-bold text-primary w-8 text-center">
              {field.value}
            </span>
          </div>
          {error && (
            <p className="text-xs text-destructive mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
