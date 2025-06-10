import { Button } from "@/application/shared/components/button";
import {
  SelectInput,
  type SelectOption as SelectInputOption,
} from "@/application/shared/components/form/select-input";
import { TextInput } from "@/application/shared/components/form/text-input";
import Modal from "@/application/shared/components/modal";
import { Form } from "@/application/shared/components/ui/form";
import { Separator } from "@/application/shared/components/ui/separator";
import { useFieldArray, useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import { Label } from "@/application/shared/components/ui/label";
import { useEffect, type Key } from "react";
import type {
  QuestionValidators,
  SelectOption,
  SurveyQuestion,
  SurveyQuestionInputType,
} from "@/survey-form/type/survey";
import { QuestionPreview } from "./components/question-preview";
import { ConditionalValues } from "./components/conditional-values";
import { ValidationRules } from "./components/validation-rules";

interface Props {
  onAddQuestion: (question: SurveyQuestion) => void;
  onUpdateQuestion: (question: SurveyQuestion) => void;
  isOpen: boolean;
  onClose: () => void;
  questionToEdit: SurveyQuestion | null;
  existingQuestions: SurveyQuestion[];
}

export interface IForm {
  label: string;
  placeholder?: string;
  hint?: string;
  type: SurveyQuestionInputType;
  isRequired: true;
  mask?: string;
  selectOptions: SelectOption[];
  enableConditional: boolean;
  conditionalFieldId?: string;
  conditionalValue?: string;
  conditionalOperator?:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "contains"
    | "is_one_of";
  conditionalValues?: {
    text: string;
  }[];
  validations: QuestionValidators[];
  pageIndex: number;
  ratingOptions?: {
    min: number;
    max: number;
    style: "stars" | "slider";
  };
}
export const ServeyModal = ({
  onAddQuestion,
  onUpdateQuestion,
  isOpen,
  onClose,
  questionToEdit,
  existingQuestions,
}: Props) => {
  const methods = useForm<IForm>({
    defaultValues: {
      pageIndex: 1,
    },
  });
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = methods;

  const handleInternalClose = () => {
    onClose();
    reset();
  };

  const formValues = watch();

  const typesWithOptions = [
    "select",
    "radio",
    "checkbox_group",
    "select_multiple",
  ];

  const needsOptions = typesWithOptions.includes(formValues?.type);
  const onSubmit = (data: IForm) => {
    if (needsOptions && data.selectOptions.length === 0) {
      methods.setError("selectOptions", {
        type: "manual",
        message: "Por favor, adicione pelo menos uma opção.",
      });
      return;
    }
    const transformedQuestionData: SurveyQuestion = {
      id: crypto.randomUUID(),
      label: data.label,
      type: data.type,
      selectOptions: needsOptions ? data.selectOptions : undefined,
      pageIndex: Number(data.pageIndex) || 1,
      ratingOptions: data.ratingOptions,
      placeholder: data.placeholder,
      hint: data.hint,
      mask: data.mask ? data.mask.split(",").map((m) => m.trim()) : null,

      validations: data.validations
        .filter((v) => v.type)
        .map((v) => v as QuestionValidators),
    };

    if (
      data.enableConditional &&
      data.conditionalFieldId &&
      data.conditionalOperator
    ) {
      if (data.conditionalOperator === "is_one_of" && data.conditionalValues) {
        transformedQuestionData.conditional = {
          fieldId: data.conditionalFieldId,
          operator: "is_one_of",
          value: data.conditionalValues.map((item) => item.text),
        };
      } else if (data.conditionalValue != null) {
        transformedQuestionData.conditional = {
          fieldId: data.conditionalFieldId,
          operator: data.conditionalOperator,
          value: data.conditionalValue,
        };
      }
    }

    if (questionToEdit) {
      onUpdateQuestion({ ...transformedQuestionData, id: questionToEdit.id });
    } else {
      onAddQuestion({ ...transformedQuestionData, id: crypto.randomUUID() });
    }

    onClose();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "selectOptions",
  });

  const typeOptions: SelectInputOption[] = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "date", label: "Data" },
    { value: "select", label: "Seleção" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio" },
    { value: "textarea", label: "Textarea" },
    { value: "rating", label: "Avaliação" },
    { value: "checkbox_group", label: "Grupo de Checkboxes" },
    { value: "select_multiple", label: "Seleção Múltipla" },
  ];

  useEffect(() => {
    methods.setValue("validations", []);
  }, [formValues.type, methods]);

  useEffect(() => {
    if (isOpen) {
      if (questionToEdit) {
        const editionValues = {
          ...questionToEdit,
          mask: Array.isArray(questionToEdit.mask)
            ? questionToEdit.mask.join(",")
            : undefined,
        };
        reset(editionValues);
      } else {
        reset({
          pageIndex: 1,
          validations: [],
          selectOptions: [],
        });
      }
    }
  }, [isOpen, questionToEdit, reset]);

  return (
    <div>
      <Form {...methods}>
        <Modal
          open={isOpen}
          onClose={handleInternalClose}
          title={questionToEdit ? "Editar Questão" : "Adicionar Questão"}
          description={
            questionToEdit
              ? "Está no modo edição de uma questão já existente"
              : "Adicione uma nova questão ao questionário"
          }
          primaryButton={{
            title: "Salvar",
            onClick: handleSubmit(onSubmit),
          }}
          className="max-h-[85vh] max-w-4xl"
        >
          <div className="flex flex-col w-[450px] gap-4 max-w-full">
            <div className="flex-1 space-y-4  overflow-y-auto max-h-[40vh] px-5">
              <h3 className="text-lg font-semibold mb-2">Especificação</h3>
              <TextInput name={"label"} label={"Titulo da questão"} required />
              <SelectInput
                required
                name={"type"}
                label={"Tipo de questão"}
                options={typeOptions}
              />
              <TextInput name={"placeholder"} label={"Placeholder"} />
              <TextInput name={"hint"} label={"Dica"} />
              <TextInput
                name={"pageIndex"}
                label={"Número da Página"}
                type="number"
                min={1}
                required
              />
              {formValues?.type === "text" && (
                <TextInput
                  name="mask"
                  label="Máscara de Input (Opcional)"
                  placeholder="exp: (00) 00000-0000"
                  helperText="Use '0' para números, 'a' para letras e '*' para qualquer caractere. Para múltiplas máscaras, separe com vírgula."
                />
              )}

              {formValues?.type === "rating" && (
                <div className="p-4 bg-gray-50 rounded-md space-y-4 border">
                  <h4 className="font-medium text-gray-800">
                    Opções de Avaliação
                  </h4>
                  <div className="flex gap-4">
                    <TextInput
                      name="ratingOptions.min"
                      label="Valor Mínimo"
                      type="number"
                      defaultValue={1}
                    />
                    <TextInput
                      name="ratingOptions.max"
                      label="Valor Máximo"
                      type="number"
                      max={
                        formValues?.ratingOptions?.style !== "slider"
                          ? 5
                          : undefined
                      }
                      min={0}
                      defaultValue={5}
                    />
                  </div>
                  <SelectInput
                    name="ratingOptions.style"
                    label="Estilo de Exibição"
                    options={[
                      { value: "stars", label: "Estrelas" },
                      { value: "slider", label: "Barra de Deslizar" },
                    ]}
                  />
                </div>
              )}

              {needsOptions && (
                <div className="space-y-3 pt-4 border-t">
                  <Label>Opções da Questão</Label>
                  {(fields || [])?.map(
                    (field: { id: Key | null | undefined }, index: number) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <TextInput
                          name={`selectOptions.${index}.label`}
                          placeholder={`Label ${index + 1}`}
                          containerClassName="flex-grow"
                        />
                        <TextInput
                          name={`selectOptions.${index}.value`}
                          placeholder={`Valor ${index + 1}`}
                          containerClassName="flex-grow"
                          onChange={() => {
                            methods.clearErrors("selectOptions");
                          }}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      append({ value: null, label: null });
                    }}
                  >
                    Adicionar Opção +
                  </Button>
                  {errors.selectOptions && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.selectOptions.message}
                    </p>
                  )}
                </div>
              )}
              <ConditionalValues existingQuestions={existingQuestions} />
              <ValidationRules />
            </div>
            {formValues?.type && (
              <div className=" flex flex-col flex-1 p-5">
                <Separator orientation="horizontal" />
                <QuestionPreview
                  {...formValues}
                  mask={
                    formValues?.mask
                      ? formValues.mask.split(",").map((m) => m.trim())
                      : undefined
                  }
                  id="test"
                />
              </div>
            )}
          </div>
        </Modal>
      </Form>
    </div>
  );
};
