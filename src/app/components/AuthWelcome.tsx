"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import Plasma from "@/components/Plasma";
import Footer from "@/components/Footer";

interface AuthWelcomeProps {
  isLogin: boolean;
}

export function AuthWelcome({ isLogin }: AuthWelcomeProps) {
  return (
    <div className="lg:w-1/2 w-full h-full bg-[var(--color-dark-navy)] dark:bg-white/5 lg:grid items-center hidden">
      <div className="relative flex flex-col items-center justify-center w-full h-full space-y-8 text-center z-10">
        <div className="relative z-20 flex flex-col items-center justify-center text-center">
          <div className="max-w-md">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <div className="flex justify-center mb-4 space-x-2">
              <Badge color="green" variant="outline" size="2">
                Secure
              </Badge>
              <Badge color="blue" variant="outline" size="2">
                Fast
              </Badge>
              <Badge color="indigo" variant="outline" size="2">
                Reliable
              </Badge>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-[var(--color-primary-text)] dark:text-gray-100">
              {isLogin ? "Welcome Back!" : "Create Your Account"}
            </h2>
            <p className="mb-8 text-lg text-[var(--color-secondary-text)] dark:text-gray-300">
              {isLogin
                ? "Secure, fast, and reliable login experience. Protect your account with our advanced security measures."
                : "Join our platform and unlock a world of secure, personalized experiences tailored just for you."}
            </p>
          </div>
        </div>

        <div className="absolute inset-0 z-10">
          <Plasma
            color="#3b82f6"
            speed={0.6}
            direction="forward"
            scale={0.5}
            opacity={0.8}
            mouseInteractive={true}
          />
          <div className="absolute bottom-0 left-0 right-0 px-8">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
