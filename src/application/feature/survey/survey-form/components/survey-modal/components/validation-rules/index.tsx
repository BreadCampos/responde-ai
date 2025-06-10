/* eslint-disable @typescript-eslint/no-explicit-any */
// Em ValidationRules.tsx

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import {
  validationMap,
  type QuestionValidatorsType,
  type SurveyQuestionInputType,
} from "@/survey-form/type/survey";
import { Button } from "@/application/shared/components/button";
import { SelectInput } from "@/application/shared/components/form/select-input";
import { TextInput } from "@/application/shared/components/form/text-input";
import { XIcon } from "lucide-react";

interface ValidationRuleRowProps {
  index: number;
  control: any;
  validationOptions: { value: string; label: string }[];
  remove: (index: number) => void;
}

const ValidationRuleRow = ({
  index,
  control,
  validationOptions,
  remove,
}: ValidationRuleRowProps) => {
  const selectedType = useWatch({
    control,
    name: `validations.${index}.type`,
  }) as QuestionValidatorsType;

  const validationHasValue = (type: QuestionValidatorsType) => {
    return ["min", "max", "min_length", "max_length", "custom"].includes(type);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <div className="flex flex-col items-center gap-2 w-full">
        <SelectInput
          name={`validations.${index}.type`}
          options={validationOptions}
          placeholder="Selecione uma regra"
          containerClassName="w-full flex-1"
        />
        {selectedType && validationHasValue(selectedType) && (
          <TextInput
            name={`validations.${index}.options.value`}
            placeholder={selectedType === "custom" ? "Regex" : "Valor"}
            containerClassName="flex-1"
            type={
              ["min", "max", "min_length", "max_length"].includes(selectedType)
                ? "number"
                : "text"
            }
          />
        )}
        <TextInput
          name={`validations.${index}.errorMessage`}
          placeholder="Mensagem de erro (opcional)"
          containerClassName="flex-1"
        />
      </div>
      <Button
        variant="destructive"
        size="icon"
        type="button"
        onClick={() => remove(index)}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const ValidationRules = () => {
  const { control } = useFormContext();
  const questionType = useWatch({
    control,
    name: "type",
  }) as SurveyQuestionInputType;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "validations",
  });

  const availableValidations = questionType
    ? validationMap[questionType] || []
    : [];
  const validationOptions = availableValidations.map((v) => ({
    value: v,
    label: v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
  }));

  return (
    <div className="space-y-3 pt-4 border-t">
      <h4 className="font-medium text-gray-800">Regras de Validação</h4>
      {fields.map((field, index) => (
        <ValidationRuleRow
          key={field.id}
          index={index}
          control={control}
          validationOptions={validationOptions}
          remove={remove}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ type: "", options: { value: "" }, errorMessage: "" })
        }
        disabled={!questionType}
      >
        Adicionar Validação +
      </Button>
    </div>
  );
};
