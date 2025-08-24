import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { FaCheckSquare, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToastContext } from "@/providers/toast-provider";
import { validate, validators, hasErrors } from "@/lib/validation";
import type { UserLoginRequest } from "@/types/User";
import { AuthService } from "@/services/authService";
import { useRouter } from "next/navigation";

export function LoginForm({ redirectUrl }: { redirectUrl: string }) {
  const router = useRouter();
  const [values, setValues] = useState<UserLoginRequest>({
    email: "",
    password: "",
    remember: false,
    redirect_url: redirectUrl,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { toast } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);

  const loginRules = {
    email: [validators.required("Email is required"), validators.email()],
    password: [validators.required("Password is required")],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);

    // Validate individual field
    const fieldErrors = validate(
      { [name]: value },
      { [name]: loginRules[name as keyof typeof loginRules] }
    );
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validate(values, loginRules);
    setErrors(validationErrors);

    // Check for any validation errors
    if (hasErrors(validationErrors)) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form",
        variant: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await AuthService.login(values);

      toast({
        title: "Login Successful",
        description: result.message,
        variant: "success",
        duration: 3000,
      });

      // Redirect to the specified URL or dashboard
      if (result.redirect_url) {
        router.push(result.redirect_url);
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "error",
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm text-center dark:text-white/90 sm:text-title-md">
          Sign In With Social Account
        </h1>
      </div>

      <div>
        <SocialLoginButtons />

        <div className="relative py-3 sm:py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border-subtle)]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="p-2 text-[var(--color-secondary-text)] bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
              Or
            </span>
          </div>
          <p className="text-sm font-semibold text-center text-[var(--color-secondary-text)]">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
              >
                Email <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="info@gmail.com"
                  value={values.email}
                  onChange={handleChange}
                  className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                    errors.email ? "border-error-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-error-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
              >
                Password <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                      errors.password ? "border-error-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <p className="text-error-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="remember-me"
                  className="flex items-center space-x-3 group cursor-pointer"
                >
                  <div className="relative w-5 h-5">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={values.remember}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          remember: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
                    />
                    {values.remember && (
                      <FaCheckSquare className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none" />
                    )}
                  </div>
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </label>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
