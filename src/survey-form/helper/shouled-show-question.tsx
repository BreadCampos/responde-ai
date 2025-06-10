/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SurveyQuestion } from "@/survey-form/type/survey";

const parseIfNumber = (value: any): any => {
  if (value === null || value === undefined || Array.isArray(value)) {
    return value;
  }
  const num = Number(value);
  return isNaN(num) ? value : num;
};

export const shouldShowQuestion = (
  question: SurveyQuestion,
  formValues: Record<string, any>
): boolean => {
  // 1. Se não houver condição, sempre exibe.
  if (!question.conditional) {
    return true;
  }

  const { fieldId, operator, value: requiredValue } = question.conditional;
  const dependentFieldValue = formValues[fieldId];

  if (dependentFieldValue === undefined || dependentFieldValue === null) {
    if (
      operator === "not_equals" &&
      requiredValue !== null &&
      requiredValue !== undefined
    ) {
      return true;
    }
    return false;
  }

  switch (operator) {
    case "equals":
      return dependentFieldValue == requiredValue;

    case "not_equals":
      return dependentFieldValue != requiredValue;

    case "contains":
      return String(dependentFieldValue)
        .toLowerCase()
        .includes(String(requiredValue).toLowerCase());

    case "is_one_of":
      return (
        Array.isArray(requiredValue) &&
        requiredValue.includes(String(dependentFieldValue))
      );

    case "greater_than":
    case "greater_than_equal":
    case "less_than":
    case "less_than_equal": {
      const val1 = parseIfNumber(dependentFieldValue);
      const val2 = parseIfNumber(requiredValue);

      if (isNaN(val1) || isNaN(val2)) {
        const date1 = new Date(dependentFieldValue).getTime();
        const date2 = new Date(String(requiredValue)).getTime();
        if (isNaN(date1) || isNaN(date2)) return false;

        if (operator === "greater_than") return date1 > date2;
        if (operator === "greater_than_equal") return date1 >= date2;
        if (operator === "less_than") return date1 < date2;
        if (operator === "less_than_equal") return date1 <= date2;
      } else {
        if (operator === "greater_than") return val1 > val2;
        if (operator === "greater_than_equal") return val1 >= val2;
        if (operator === "less_than") return val1 < val2;
        if (operator === "less_than_equal") return val1 <= val2;
      }
      return false;
    }

    default:
      return false;
  }
};
