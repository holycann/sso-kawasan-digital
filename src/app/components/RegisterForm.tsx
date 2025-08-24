"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { FaCheckSquare, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToastContext } from "@/providers/toast-provider";
import { validate, validators, hasErrors } from "@/lib/validation";
import { AuthService } from "@/services/authService";
import type { UserRegistrationRequest } from "@/types/User";

interface RegisterFormProps {
  onToggleForm: () => void;
  setIsLogin: (value: boolean) => void;
}

export function RegisterForm({ onToggleForm, setIsLogin }: RegisterFormProps) {
  const [values, setValues] = useState<
    UserRegistrationRequest & { confirm_password?: string }
  >({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    confirm_password: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToastContext();

  const registrationRules = {
    first_name: [
      validators.required("First name is required"),
      validators.min(2, "First name must be at least 2 characters"),
    ],
    last_name: [
      validators.required("Last name is required"),
      validators.min(2, "Last name must be at least 2 characters"),
    ],
    email: [
      validators.required("Email is required"),
      validators.email("Please enter a valid email address"),
    ],
    password: [
      validators.required("Password is required"),
      validators.password(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      ),
    ],
    confirm_password: [
      validators.required("Confirm password is required"),
      validators.match("password", values, "Passwords do not match"),
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValues = { ...values, [name]: value };
    setValues(updatedValues);

    // Validate individual field
    const fieldErrors = validate(
      { [name]: value },
      { [name]: registrationRules[name as keyof typeof registrationRules] }
    );

    // Clear error if validation passes
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validate(values, registrationRules);

    setErrors(validationErrors);

    // Check terms acceptance
    if (!termsAccepted) {
      toast({
        title: "Terms Not Accepted",
        description: "Please accept the Terms and Conditions",
        variant: "error",
        duration: 3000,
      });
      return;
    }

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
      // Remove confirm_password before sending to registration service
      const { confirm_password, ...registrationData } = values;
      const result = await AuthService.register(registrationData);

      if (result.success) {
        toast({
          title: "Registration Successful",
          description: result.message,
          variant: "success",
          duration: 3000,
        });

        // Switch to login form
        setIsLogin(true);
        onToggleForm();
      } else {
        toast({
          title: "Registration Error",
          description: result.message,
          variant: "error",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
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
          <p className="text-sm text-center font-semibold text-[var(--color-secondary-text)]">
            Enter your email and password to sign up!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="first_name"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
                >
                  First Name <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter your first name"
                    value={values.first_name}
                    onChange={handleChange}
                    required
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                      errors.first_name ? "border-error-500" : ""
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-error-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="last_name"
                  className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
                >
                  Last Name <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your last name"
                    value={values.last_name}
                    onChange={handleChange}
                    required
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                      errors.last_name ? "border-error-500" : ""
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-error-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
              >
                Email <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={handleChange}
                  required
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    required
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                      errors.password ? "border-error-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error-500 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="mb-1.5 block text-sm font-medium text-[var(--color-secondary-text)]"
              >
                Confirm Password <span className="text-error-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Confirm your password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    required
                    className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-[var(--color-muted-text)] focus:outline-hidden focus:ring-3 bg-transparent text-[var(--color-primary-text)] border-[var(--color-border-subtle)] focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]/20 ${
                      errors.confirm_password ? "border-error-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-error-500 text-xs mt-1">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="terms"
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <div className="relative w-5 h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                    className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60"
                  />
                  {termsAccepted && (
                    <FaCheckSquare className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-4 h-4 pointer-events-none" />
                  )}
                </div>
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions
                  </span>
                  , and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </label>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
