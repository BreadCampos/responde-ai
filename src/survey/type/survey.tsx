export type SurveyQuestionInputType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "datetime"
  | "radio"
  | "checkbox"
  | "checkbox_group"
  | "select"
  | "select_multiple"
  | "rating";

export type QuestionValidatorsType =
  | "email"
  | "url"
  | "number_only"
  | "cpf"
  | "cnpj"
  | "required"
  | "min"
  | "max"
  | "min_length"
  | "max_length"
  | "custom";

export type SelectOption = {
  value: string | number | boolean | null;
  label: string | number | React.ReactNode | boolean | null;
  disabled?: boolean;
};
type RatingStyle = "stars" | "slider";

type RatingOptions = {
  min: number;
  max: number;
  style: RatingStyle;
};

export type QuestionValidators = {
  type: QuestionValidatorsType;
  regex?: string;
  errorMessage?: string;
  options?: {
    value?: string | number;
  };
};

export type QuestionConditionOperators =
  | "equals"
  | "not_equals"
  | "greater_than_equal"
  | "greater_than"
  | "less_than"
  | "less_than_equal"
  | "contains"
  | "is_one_of";

export type QuestionConditionOptions = {
  operator: QuestionConditionOperators;
  fieldId: string;
  value: string | string[];
};

export type SurveyQuestion = {
  id: string;
  label: string;
  orderIndex?: number;
  pageIndex: number;
  type: SurveyQuestionInputType;
  validations: Array<QuestionValidators>;
  placeholder?: string;
  hint?: string;
  mask?: string[] | null;
  selectOptions?: Array<SelectOption>;
  ratingOptions?: RatingOptions;
  conditional?: QuestionConditionOptions;
};

export type Survey = {
  id: string;
  title: string;
  questions: Array<SurveyQuestion>;
};

export const validationMap: Record<
  SurveyQuestionInputType,
  Array<QuestionValidatorsType>
> = {
  text: [
    "required",
    "email",
    "min_length",
    "max_length",
    "custom",
    "cnpj",
    "cpf",
  ],
  textarea: ["required", "min_length", "max_length", "custom"],
  number: ["required", "min", "max", "custom"],
  date: ["required", "min", "max", "custom"],
  datetime: ["required", "min", "max", "custom"],
  radio: ["required"],
  checkbox: ["required"],
  checkbox_group: ["required", "min_length", "max_length"],
  select: ["required"],
  select_multiple: ["required", "min_length", "max_length"],
  rating: ["required"],
};

export const operatorMap: Record<
  SurveyQuestionInputType,
  QuestionConditionOperators[]
> = {
  text: ["equals", "not_equals", "contains"],
  textarea: ["equals", "not_equals", "contains"],
  select: ["equals", "not_equals", "is_one_of"],
  radio: ["equals", "not_equals", "is_one_of"],
  number: [
    "equals",
    "not_equals",
    "greater_than",
    "greater_than_equal",
    "less_than",
    "less_than_equal",
  ],
  date: [
    "equals",
    "not_equals",
    "greater_than",
    "greater_than_equal",
    "less_than",
    "less_than_equal",
  ],
  datetime: [
    "equals",
    "not_equals",
    "greater_than",
    "greater_than_equal",
    "less_than",
    "less_than_equal",
  ],
  rating: [
    "equals",
    "not_equals",
    "greater_than",
    "greater_than_equal",
    "less_than",
    "less_than_equal",
  ],
  checkbox: ["equals", "not_equals"],
  checkbox_group: ["contains", "is_one_of"],
  select_multiple: ["contains", "is_one_of"],
};
