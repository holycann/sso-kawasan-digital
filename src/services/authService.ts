/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Nothing> */
import { supabase } from "@/configs/supabase";
import type { UserLoginRequest, UserRegistrationRequest } from "@/types/User";
import Cookies from "js-cookie";

/**
 * Authentication service for managing user authentication operations
 */
export class AuthService {
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

      // Save access token to HTTP-only cookie
      if (data.session?.access_token) {
        const expiresIn = credentials.remember ? 1 : 1 / 24; // 1 day if remember, 1 hour otherwise
        Cookies.set("access_token", data.session.access_token, {
          expires: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }

      return {
        redirect_url:
          credentials.redirect_url + `?token=${data.session?.access_token}`,
        message: "Login berhasil",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan saat login";

      throw new Error(errorMessage);
    }
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
      const errorMessage =
        error instanceof Error ? error.message : "Gagal melakukan registrasi";

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

      // Remove access token cookie on logout
      Cookies.remove("access_token");

      return {
        success: true,
        message: "Berhasil logout",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal logout";

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
}
