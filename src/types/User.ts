export interface UserRegistrationRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
  remember?: boolean;
  redirect_url: string;
}