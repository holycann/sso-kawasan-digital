export interface UserRegistrationRequest {
  email: string;
  username: string;
  fullname: string;
  phone?: string;
  address?: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
  remember?: boolean;
  redirect_url: string;
}

export interface AuthResponse {
  access_token: string;
  expires_at: number;
  redirect_url?: string;
}
