/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Nothing> */
import { supabase } from "@/configs/supabase";
import type { UserLoginRequest, UserRegistrationRequest } from "@/types/User";
import Cookies from "js-cookie";

/**
 * Authentication service for managing user authentication operations
 */
export class AuthService {
  /**
   * Set cookie with common configuration
   * @param name Cookie name
   * @param value Cookie value
   * @param expiresIn Expiration in days
   */
  private static setCookie(
    name: string,
    value: string,
    expiresIn: number
  ): void {
    Cookies.set(name, value, {
      expires: expiresIn,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  /**
   * Remove authentication-related cookies
   */
  private static clearAuthCookies(): void {
    Cookies.remove("access_token");
    Cookies.remove("token_expires_at");
    Cookies.remove("remember_me");
  }

  /**
   * Handle authentication errors
   * @param error Error object
   * @param defaultMessage Default error message
   * @returns Formatted error message
   */
  private static handleAuthError(
    error: unknown,
    defaultMessage: string
  ): string {
    return error instanceof Error ? error.message : defaultMessage;
  }

  /**
   * Login with email and password
   * @param credentials User login credentials
   * @returns Promise resolving to authenticated user or null
   */
  static async login(
    credentials: UserLoginRequest
  ): Promise<{ redirect_url: string | null; message: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        switch (error.message) {
          case "Invalid login credentials":
            throw new Error("Email atau password salah");
          case "Email not confirmed":
            throw new Error("Silakan konfirmasi email Anda terlebih dahulu");
          default:
            throw new Error(error.message || "Terjadi kesalahan saat login");
        }
      }

      // Save access token to cookie
      if (data.session?.access_token) {
        const expiresIn = credentials.remember ? 1 : 1 / 24; // 1 day if remember, 1 hour otherwise
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(
          tokenExpiresAt.getHours() + (credentials.remember ? 24 : 1)
        );

        this.setCookie("access_token", data.session.access_token, expiresIn);
        this.setCookie(
          "token_expires_at",
          tokenExpiresAt.toISOString(),
          expiresIn
        );
        this.setCookie(
          "remember_me",
          credentials.remember ? "true" : "false",
          expiresIn
        );
      }

      return {
        redirect_url:
          credentials.redirect_url + `?token=${data.session?.access_token}`,
        message: "Login berhasil",
      };
    } catch (error) {
      const errorMessage = this.handleAuthError(
        error,
        "Terjadi kesalahan saat login"
      );
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if token is expired and needs refresh
   * @returns boolean indicating if token is expired
   */
  static isTokenExpired(): boolean {
    const tokenExpiresAt = Cookies.get("token_expires_at");
    if (!tokenExpiresAt) return true;

    const expirationDate = new Date(tokenExpiresAt);
    return new Date() >= expirationDate;
  }

  /**
   * Determine if auto-refresh is allowed based on remember me setting
   * @returns boolean indicating if auto-refresh is allowed
   */
  static isAutoRefreshAllowed(): boolean {
    const rememberMe = Cookies.get("remember_me");
    return rememberMe === "true";
  }

  /**
   * Register a new user
   * @param registrationData User registration details
   * @returns Promise resolving to registration message
   */
  static async register(
    registrationData: UserRegistrationRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signUp({
        email: registrationData.email,
        password: registrationData.password,
        options: {
          data: {
            full_name: registrationData.first_name,
            last_name: registrationData.last_name,
          },
        },
      });

      if (error) {
        switch (error.message) {
          case "User already exists":
            throw new Error("Email sudah terdaftar");
          case "Invalid email format":
            throw new Error("Format email tidak valid");
          default:
            throw new Error(error.message || "Gagal melakukan registrasi");
        }
      }

      return {
        success: true,
        message: "Registrasi berhasil. Silakan login untuk melanjutkan.",
      };
    } catch (error) {
      const errorMessage = this.handleAuthError(
        error,
        "Gagal melakukan registrasi"
      );
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message || "Gagal logout");
      }

      // Remove access token and related cookies on logout
      this.clearAuthCookies();

      return {
        success: true,
        message: "Berhasil logout",
      };
    } catch (error) {
      const errorMessage = this.handleAuthError(error, "Gagal logout");
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Get current authentication token and redirect URI
   * @returns Promise resolving to authentication token, message, and redirect URI
   */
  static async getAuthToken(redirect_url: string): Promise<{
    message: string;
    redirect_url?: string;
  }> {
    try {
      // First try to get token from cookie
      const cookieToken = Cookies.get("access_token");

      // Check if token is expired and auto-refresh is allowed
      if (cookieToken && this.isTokenExpired() && this.isAutoRefreshAllowed()) {
        const refreshResult = await this.refreshAuthToken();
        if (refreshResult.success && refreshResult.token) {
          return {
            message: "Token diperbarui otomatis",
            redirect_url: redirect_url + `?token=${refreshResult.token}`,
          };
        }
      }

      if (cookieToken)
        return {
          message: "Token didapatkan dari cookie",
          redirect_url: redirect_url + `?token=${cookieToken}`,
        };

      // Fallback to Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return {
        message: session?.access_token
          ? "Token didapatkan dari sesi"
          : "Tidak ada token tersedia",
        redirect_url: redirect_url + `?token=null`,
      };
    } catch (error) {
      console.error("Failed to get auth token:", error);
      return {
        message: "Gagal mendapatkan token",
      };
    }
  }

  /**
   * Refresh authentication token using Supabase
   * @returns Promise resolving to new access token or null
   */
  static async refreshAuthToken(): Promise<{
    success: boolean;
    message: string;
    token?: string;
  }> {
    try {
      // Check if auto-refresh is allowed
      if (!this.isAutoRefreshAllowed()) {
        return {
          success: false,
          message: "Auto refresh tidak diizinkan",
        };
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        console.error("Token refresh error:", error);
        return {
          success: false,
          message: error.message || "Failed to refresh token",
        };
      }

      if (session?.access_token) {
        // Update cookie with new token
        const expiresIn = 1; // 1 day for remember me
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);

        this.setCookie("access_token", session.access_token, expiresIn);
        this.setCookie(
          "token_expires_at",
          tokenExpiresAt.toISOString(),
          expiresIn
        );

        return {
          success: true,
          message: "Token berhasil diperbarui",
          token: session.access_token,
        };
      }

      return {
        success: false,
        message: "No new session available",
      };
    } catch (error) {
      console.error("Unexpected error during token refresh:", error);
      return {
        success: false,
        message: this.handleAuthError(error, "Token refresh failed"),
      };
    }
  }
}