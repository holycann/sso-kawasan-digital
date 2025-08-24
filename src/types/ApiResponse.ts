/**
 * Standard API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
  error?: ApiError | string;
}

export interface ApiError {
  code?: string;
  details?: string;
}

/**
 * Type guard to check if the response is a successful API response
 */
export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    response &&
    typeof response.success === "boolean" &&
    response.success === true
  );
}
