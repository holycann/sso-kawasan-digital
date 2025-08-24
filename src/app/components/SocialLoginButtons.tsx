"use client";

import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { useToastContext } from "@/providers/toast-provider";
import { useState } from "react";

// Define social login types for better type safety
type SocialProvider = "google" | "x";

export function SocialLoginButtons() {
  const { toast } = useToastContext();
  const [isLoading, setIsLoading] = useState<SocialProvider | null>(null);

  // Generic social login handler
  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(provider);

    try {
      // TODO: Implement actual social login logic for each provider
      switch (provider) {
        case "google":
          // Placeholder for Google OAuth logic
          await simulateSocialLogin("Google");
          break;
        case "x":
          // Placeholder for X (Twitter) OAuth logic
          await simulateSocialLogin("X");
          break;
      }
    } catch (error) {
      toast({
        title: `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } Login Error`,
        description: `Failed to complete ${provider} login. Please try again.`,
        variant: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(null);
    }
  };

  // Simulate social login (to be replaced with actual OAuth logic)
  const simulateSocialLogin = async (provider: string) => {
    // Simulated async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: `${provider} Login`,
      description: "Feature coming soon! Stay tuned for social login.",
      variant: "info",
      duration: 3000,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
      <Button
        variant="social"
        size="social"
        onClick={() => handleSocialLogin("google")}
        disabled={isLoading === "google"}
      >
        <FcGoogle size={20} />
        {isLoading === "google" ? "Connecting..." : "Sign in with Google"}
      </Button>
      <Button
        variant="social"
        size="social"
        onClick={() => handleSocialLogin("x")}
        disabled={isLoading === "x"}
      >
        <FaXTwitter size={20} />
        {isLoading === "x" ? "Connecting..." : "Sign in with X"}
      </Button>
    </div>
  );
}
