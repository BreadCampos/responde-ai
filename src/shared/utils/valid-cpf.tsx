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
