/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Nothing> */
import { BaseApiService } from "@/services/baseApiService";
import type {
  AuthResponse,
  UserLoginRequest,
  UserRegistrationRequest,
} from "@/types/Auth";
import type { ApiResponse } from "@/types/ApiResponse";
import Cookies from "js-cookie";

export class AuthService extends BaseApiService {
  private static setCookie(name: string, value: string, expiresAt: Date): void {
    Cookies.set(name, value, {
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  private static clearAuthCookies(): void {
    Cookies.remove("access_token");
    Cookies.remove("remember_me");
  }

  static async login(
    credentials: UserLoginRequest
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await BaseApiService.post<
        UserLoginRequest,
        AuthResponse
      >("/auth/login", credentials);

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Login gagal",
          data: null,
        };
      }

      const { access_token, expires_at } = response.data!;
      const expiresAt = new Date(expires_at * 1000);

      this.setCookie("access_token", access_token, expiresAt);
      this.setCookie(
        "remember_me",
        credentials.remember ? "true" : "false",
        credentials.remember
          ? new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000)
          : expiresAt
      );

      return {
        success: true,
        message: "Login berhasil",
        data: {
          access_token,
          expires_at,
          redirect_url: `${credentials.redirect_url}?token=${access_token}`,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async register(
    registrationData: UserRegistrationRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BaseApiService.post<UserRegistrationRequest>(
        "/auth/register",
        registrationData
      );

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Registrasi gagal",
        };
      }

      return {
        success: true,
        message: "Registrasi berhasil, cek email konfirmasi.",
      };
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await BaseApiService.post("/auth/logout");
      this.clearAuthCookies();

      if (!response.success) {
        return {
          success: false,
          message: response.message || "Logout gagal",
        };
      }

      return { success: true, message: "Logout berhasil" };
    } catch (error) {
      throw error;
    }
  }

  static async getAuthToken(
    redirect_url: string
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      let token = Cookies.get("access_token");
      const remember = Cookies.get("remember_me") === "true";

      if (!token && remember) {
        const refreshResult = await this.refreshAuthToken();
        if (refreshResult.success && refreshResult.data?.access_token) {
          token = refreshResult.data.access_token;
        }
      }

      if (!token && !remember) {
        throw new Error("Silahkan login kembali");
      }

      if (token) {
        return {
          success: true,
          message: "Token aktif",
          data: {
            access_token: token,
            expires_at: 0,
            redirect_url: `${redirect_url}?token=${token}`,
          },
        };
      }

      return {
        success: false,
        message: "Tidak ada token",
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }

  static async refreshAuthToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await BaseApiService.post<void, AuthResponse>(
        "/auth/refresh-token"
      );

      if (!response.success || !response.data?.access_token) {
        return {
          success: false,
          message: response.message || "Refresh gagal",
          data: null,
        };
      }

      const { access_token, expires_at } = response.data!;
      const expiresAt = new Date(expires_at * 1000);

      this.setCookie("access_token", access_token, expiresAt);
      this.setCookie(
        "remember_me",
        "true",
        new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000)
      );

      return {
        success: true,
        message: "Token diperbarui",
        data: {
          access_token: access_token,
          expires_at: expires_at,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
