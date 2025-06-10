import { InputPreview } from "@/survey-form/components/input-preview";
import type { SurveyQuestion } from "@/application/feature/survey/survey-form/type/survey";
export const QuestionPreview = (options: SurveyQuestion) => {
  return (
    <div className="py-4 ml-2 mb-4">
      <h3 className="text-lg font-semibold mb-2">Pré vizualização</h3>
      <InputPreview
        question={{
          ...options,
          validations: options.validations?.filter(
            (validation) => validation.type !== "required"
          ),
        }}
      />
    </div>
  );
};
