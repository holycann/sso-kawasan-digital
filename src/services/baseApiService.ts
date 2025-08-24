/** biome-ignore-all lint/style/useImportType: <Nothing> */
/** biome-ignore-all lint/complexity/noStaticOnlyClass: <Nothing> */
import { ApiResponse, isApiResponse } from "@/types/ApiResponse";
import { logger } from "@/lib/logger";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class BaseApiService {
  // Single static axios instance for all services
  private static axiosInstance: AxiosInstance | null = null;

  /**
   * Get the configured axios instance
   */
  protected static getAxiosInstance(): AxiosInstance {
    // Initialize axios if not already initialized
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8181",
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return this.axiosInstance;
  }

  /**
   * Perform GET request
   * @param url Endpoint URL
   * @param config Optional axios request configuration
   * @returns Promise with response data
   */
  protected static async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.getAxiosInstance().get(url, config);
      return this.normalizeResponse<T>(response.data);
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  /**
   * Perform POST request
   * @param url Endpoint URL
   * @param data Request payload
   * @param config Optional axios request configuration
   * @returns Promise with response data
   */
  protected static async post<T, R = T>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    try {
      const response = await this.getAxiosInstance().post(url, data, config);
      return this.normalizeResponse<R>(response.data);
    } catch (error) {
      return this.handleError<R>(error);
    }
  }

  private static normalizeResponse<T>(data: any): ApiResponse<T> {
    return {
      success: Boolean(data?.success ?? (data?.error ? false : true)),
      message: data?.message,
      data: (data?.data ?? null) as T | null,
      error: undefined,
    };
  }

  /**
   * Handle API response with option to throw or fallback
   */
  protected static handleApiResponse<T>(
    response: any,
    throwOnError: boolean = false
  ): ApiResponse<T> {
    if (isApiResponse<T>(response)) {
      return response;
    }

    if (throwOnError) {
      throw new Error(response?.message);
    }

    return {
      success: false,
      data: null,
      error: response?.message,
    };
  }

  private static handleError<T>(error: any): ApiResponse<T> {
    // Check if error response follows backend error structure
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const message: string =
        errorData?.message || errorData?.error?.details || "An error occurred";
      const structuredDetails = errorData?.error || {
        code: errorData?.error?.code,
        details: errorData?.error?.details,
      };

      const errorResponse: ApiResponse<T> = {
        success: false,
        message,
        data: null,
        error: structuredDetails,
      };

      // Log the error
      logger.error("BaseApiService", "API Error", errorResponse);

      return errorResponse;
    }

    // Network or other errors
    const networkMessage = error?.message || "An unexpected error occurred";
    const networkErrorResponse: ApiResponse<T> = {
      success: false,
      message: networkMessage,
      data: null,
      error: networkMessage,
    };

    logger.error("BaseApiService", "Network Error", networkMessage);

    return networkErrorResponse;
  }
}
