import AsyncStorage from "@react-native-async-storage/async-storage";

import { authenticationApi } from "~/application/feature/authentication/api";

export interface HttpRequest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export interface HttpResponse<T = any> {
  status: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export class AuthorizedHttpClient {
  private readonly whiteListUrl = [authenticationApi?.SING_UP_LOCAL];

  private readonly baseUrl: string = process.env.APP_URL;

  private readonly refreshTokenKey: string = "REFRESH_TOKEN";
  private readonly tokenKey: string = "AUTH_TOKEN";

  async request<T>(data: HttpRequest): Promise<HttpResponse<T>> {
    const token = await AsyncStorage.getItem(this.tokenKey);

    if (token) {
      data.headers = {
        ...data.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${data.url}`, {
        method: data.method,
        headers: {
          "Content-Type": "application/json",
          ...data.headers,
        },
        body: data.body ? JSON.stringify(data.body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (
          responseData.error?.statusCode === "ExpiredTokenException" &&
          !this.whiteListUrl.some((url) => data.url.includes(url))
        ) {
          const refreshToken = await AsyncStorage.getItem(this.refreshTokenKey);
          const tokenOrError = await this.getRefreshToken(refreshToken);

          if (tokenOrError.error) {
            this.handleUnauthorized();
            this.showErrorToast(tokenOrError.error.message);
            return { status: response.status, error: tokenOrError.error };
          }

          await AsyncStorage.setItem(
            this.tokenKey,
            tokenOrError.data?.token || ""
          );
          return this.request<T>(
            this.addNewTokenToHeaders(tokenOrError.data?.token || "", data)
          );
        }
        if (
          responseData.error?.statusCode === "UnauthorizedException" &&
          !this.whiteListUrl.some((url) => data.url.includes(url))
        ) {
          this.handleUnauthorized();
        }

        this.showErrorToast(responseData?.message || "Erro desconhecido");

        const message = Array.isArray(responseData?.message)
          ? responseData?.message?.[0]
          : responseData?.message;

        this.showErrorToast(message || "Erro desconhecido");
        throw new Error(message || "Erro na requisição");
      }

      return { status: response.status, data: responseData };
    } catch (error: any) {
      console.log(error);
      const message = error?.message || "Erro de rede";

      console.log("oi", message, error);
      this.showErrorToast(message);
      throw new Error(message);
    }
  }

  private async getRefreshToken(
    refreshToken: string | null
  ): Promise<HttpResponse<{ token: string }>> {
    if (!refreshToken) {
      const error = {
        code: "NoRefreshToken",
        message: "Refresh token não encontrado",
      };
      this.showErrorToast(error.message);
      return {
        status: 401,
        error,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/account/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        this.showErrorToast(responseData?.message || "Erro ao renovar token");
        return { status: response.status, error: responseData.error };
      }

      return {
        status: response.status,
        data: { token: responseData.accessToken },
      };
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      this.showErrorToast("Erro de rede");
      return {
        status: 500,
        error: { code: "NetworkError", message: "Erro de rede" },
      };
    }
  }

  private addNewTokenToHeaders(
    newAccessToken: string,
    request: HttpRequest
  ): HttpRequest {
    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    };
  }

  private async handleUnauthorized() {
    await AsyncStorage.removeItem(this.tokenKey);
    await AsyncStorage.removeItem(this.refreshTokenKey);
    console.warn("Usuário não autorizado. Redirecionando para login...");
    this.showErrorToast("Usuário não autorizado. Faça login novamente.");
  }

  private showErrorToast(message: string) {
    console.log({ message });
  }
}

export const httpClient = new AuthorizedHttpClient();
