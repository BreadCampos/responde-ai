/* eslint-disable no-useless-escape */
import type { QuestionValidators } from "@/survey-form/type/survey";
import type { RegisterOptions } from "react-hook-form";
// Esta função valida um CPF brasileiro.
export function isValidCPF(cpf: string | null | undefined): boolean {
  if (!cpf) return false;

  // Remove caracteres não numéricos
  const cpfDigits = cpf.replace(/\D/g, "");

  if (cpfDigits.length !== 11 || /^(\d)\1{10}$/.test(cpfDigits)) {
    return false;
  }

  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfDigits.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpfDigits.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfDigits.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cpfDigits.substring(10, 11))) {
    return false;
  }

  return true;
}

// Esta função valida um CNPJ brasileiro.
export function isValidCNPJ(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;

  const cnpjDigits = cnpj.replace(/\D/g, "");

  if (cnpjDigits.length !== 14 || /^(\d)\1{13}$/.test(cnpjDigits)) {
    return false;
  }

  let size = cnpjDigits.length - 2;
  let numbers = cnpjDigits.substring(0, size);
  const digits = cnpjDigits.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  size = size + 1;
  numbers = cnpjDigits.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }

  return true;
}
// Função auxiliar// Em /helper/getValidationRules.ts (ou onde a função estiver)

export const getValidationRules = (
  validations: Array<QuestionValidators>
): RegisterOptions => {
  if (!validations || validations.length === 0) {
    return {};
  }

  const rules: RegisterOptions = {};

  for (const validator of validations) {
    switch (validator.type) {
      case "required":
        rules.required = validator.errorMessage || "Este campo é obrigatório";
        break;
      case "min_length":
        rules.minLength = {
          value: Number(validator.options?.value),
          message:
            validator.errorMessage ||
            `O tamanho mínimo é ${validator.options?.value}`,
        };
        break;
      case "max_length":
        rules.maxLength = {
          value: Number(validator.options?.value),
          message:
            validator.errorMessage ||
            `O tamanho máximo é ${validator.options?.value}`,
        };
        break;
      case "min":
        rules.min = {
          value: Number(validator.options?.value),
          message:
            validator.errorMessage ||
            `O valor mínimo é ${validator.options?.value}`,
        };
        break;
      case "max":
        rules.max = {
          value: Number(validator.options?.value),
          message:
            validator.errorMessage ||
            `O valor máximo é ${validator.options?.value}`,
        };
        break;
      case "email":
        rules.pattern = {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: validator.errorMessage || "Formato de email inválido",
        };
        break;
      case "cpf":
        rules.validate = (cpf: string) =>
          isValidCPF(cpf) || validator.errorMessage;
        break;
      case "cnpj":
        rules.validate = (cnpj: string) =>
          isValidCNPJ(cnpj) || validator.errorMessage;
        break;
      case "custom":
        if (validator.regex) {
          rules.pattern = {
            value: new RegExp(validator.regex),
            message:
              validator.errorMessage || "O valor não corresponde ao padrão",
          };
        }
        break;
    }
  }

  return rules;
};
