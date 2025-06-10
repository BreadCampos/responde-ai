/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SurveyQuestion } from "@/survey-form/type/survey";
import {
  TextInput,
  SelectInput,
  CheckboxInput,
  RadioGroupInput,
  TextareaInput,
  RatingStarsInput,
  SlideInput,
  SelectMultipleInput,
} from "@/components/form";
import { CheckboxGroupInput } from "@/components/form/checkbox-group-input";
import { MaskedInput } from "@/components/form/mask-input";
import { getValidationRules } from "@/survey-form/helper/get-validation-rules";

interface Props {
  question: SurveyQuestion;
  dontRequired?: boolean;
}

export const InputPreview = ({ question }: Props) => {
  const rules: Record<string, any> = getValidationRules(question.validations);

  const renderInput = (name: any, rules: any) => {
    switch (question.type) {
      case "text":
        if (question.mask) {
          return (
            <MaskedInput
              name={name}
              placeholder={question?.placeholder}
              label={question?.label}
              rules={rules}
              mask={question.mask}
            />
          );
        }
        return (
          <TextInput
            name={name}
            placeholder={question?.placeholder}
            label={question?.label}
            rules={rules}
            type={question.type}
          />
        );

      case "textarea":
        return (
          <TextareaInput name={name} label={question?.label} rules={rules} />
        );

      case "number":
        return (
          <TextInput
            name={name}
            placeholder={question?.placeholder}
            type="number"
            label={question?.label}
            rules={rules}
          />
        );

      case "select":
        return (
          <SelectInput
            name={name}
            placeholder={question?.placeholder}
            label={question?.label}
            options={question.selectOptions || []}
            rules={rules}
          />
        );
        break;
      case "date":
        return (
          <TextInput
            name={name}
            placeholder={question?.placeholder}
            label={question?.label}
            rules={rules}
            type="date"
          />
        );
        break;
      case "checkbox":
        return (
          <CheckboxInput name={name} rules={rules} label={question?.label} />
        );

      case "radio":
        return (
          <RadioGroupInput
            options={question?.selectOptions || []}
            name={name}
            label={question?.label}
            rules={rules}
            className="flex flex-col"
          />
        );

      case "rating":
        if (question.ratingOptions?.style === "slider") {
          return <SlideInput name={name} question={question} />;
        }
        return (
          <RatingStarsInput
            name={name}
            label={question?.label}
            rules={rules}
            min={question.ratingOptions?.min}
            max={question.ratingOptions?.max}
          />
        );

      case "checkbox_group":
        return (
          <CheckboxGroupInput
            name={question.id}
            label={question.label}
            options={question.selectOptions || []}
            rules={rules}
          />
        );
      case "select_multiple":
        return (
          <SelectMultipleInput
            name={question.id}
            label={question.label}
            options={question.selectOptions || []}
            rules={rules}
            placeholder="Selecione uma ou mais opções"
          />
        );
      default:
        break;
    }
  };

  return (
    <div>
      {renderInput(question.id, rules)}
      <p className="text-gray-600 text-sm m-2">{question?.hint}</p>
    </div>
  );
};
