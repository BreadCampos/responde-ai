// Em ConditionalValues.tsx

import { Button } from "@/application/shared/components/button";
import {
  CheckboxInput,
  SelectInput,
  TextInput,
  type SelectOption,
} from "@/application/shared/components/form";
import { Label } from "@/application/shared/components/ui/label";
import {
  operatorMap,
  type QuestionConditionOperators,
  type SurveyQuestion,
} from "@/survey-form/type/survey";

import type { IForm } from "../../index";
import { XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useMemo } from "react";

interface Props {
  existingQuestions: SurveyQuestion[];
}
export const ConditionalValues = ({ existingQuestions }: Props) => {
  const { watch, setValue, control } = useFormContext<IForm>();

  const formValues = watch();

  const questionOptionsForSelect: SelectOption[] = existingQuestions.map(
    (q) => ({
      label: q.label,
      value: q.id,
    })
  );

  const allOperationOptions: SelectOption[] = [
    { value: "equals", label: "Igual a" },
    { value: "not_equals", label: "Diferente de" },
    { value: "greater_than", label: "Maior que" },
    { value: "greater_than_equal", label: "Maior ou igual a" }, // NOVO
    { value: "less_than", label: "Menor que" },
    { value: "less_than_equal", label: "Menor ou igual a" }, // NOVO
    { value: "contains", label: "Contém" },
    { value: "is_one_of", label: "É um de (OU)" },
  ];

  const dependentFieldType = existingQuestions.find(
    (q) => q.id === formValues.conditionalFieldId
  )?.type;

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: "conditionalValues",
  });

  const filteredOperationOptions = useMemo(() => {
    if (!dependentFieldType) return [];

    const allowedOperators = operatorMap[dependentFieldType] || [];
    return allOperationOptions.filter((opt) =>
      allowedOperators.includes(opt.value as QuestionConditionOperators)
    );
  }, [dependentFieldType]);

  useEffect(() => {
    setValue("conditionalOperator", undefined);
  }, [formValues.conditionalFieldId, setValue]);

  if (existingQuestions.length === 1) return null;

  return (
    <div className="space-y-3 pt-4 border-t">
      <CheckboxInput
        name="enableConditional"
        label="Adicionar lógica condicional?"
      />

      {formValues?.enableConditional && (
        <div className="p-4 bg-gray-50 rounded-md space-y-4">
          <SelectInput
            required={formValues?.enableConditional}
            name="conditionalFieldId"
            label="Aparecer somente se a pergunta..."
            options={questionOptionsForSelect}
            placeholder="Selecione uma pergunta"
          />
          <SelectInput
            name="conditionalOperator"
            required={formValues?.enableConditional}
            label="...a condição for..."
            placeholder="Selecione uma condição"
            options={filteredOperationOptions}
            disabled={!dependentFieldType}
          />

          {formValues?.conditionalOperator === "is_one_of" ? (
            <div className="space-y-2">
              <Label>...um dos seguintes valores:</Label>
              {valueFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <TextInput
                    required={formValues?.enableConditional}
                    name={`conditionalValues.${index}.text`}
                    placeholder={`Valor ${index + 1}`}
                    containerClassName="flex-grow"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    type="button"
                    onClick={() => removeValue(index)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendValue({ text: "" })}
              >
                Adicionar Valor
              </Button>
            </div>
          ) : (
            <div className="conditional-value-input">
              <Label>...o valor:</Label>

              {dependentFieldType === "date" && (
                <TextInput
                  required={formValues?.enableConditional}
                  name="conditionalValue"
                  type="date"
                />
              )}
              {["text", "select", "radio", "textarea", undefined].includes(
                dependentFieldType
              ) && (
                <TextInput
                  required={formValues?.enableConditional}
                  name="conditionalValue"
                  placeholder="Coloque o valor"
                />
              )}
              {dependentFieldType === "number" && (
                <TextInput
                  required={formValues?.enableConditional}
                  name="conditionalValue"
                  type="number"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
