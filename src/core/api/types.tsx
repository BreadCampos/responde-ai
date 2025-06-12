/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiUrl = {
  [key: `${Uppercase<string>}`]: `/${string}`;
};

export class UnauthorizedError extends Error {
  constructor() {
    super("Usuário não autorizado");
    this.name = "UnauthorizedError";
  }
}

export interface HttpRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export interface HttpResponse<T = any> {
  status: number;
  data?: T;
}
