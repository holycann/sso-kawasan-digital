"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { AuthWelcome } from "./components/AuthWelcome";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { TabsList, Tabs, TabsTrigger } from "@/components/ui/Tabs";
import Link from "next/link";
import { CiCircleChevLeft } from "react-icons/ci";
import { AuthService } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const loginFormRef = useRef<HTMLDivElement>(null);
  const registerFormRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const redirectUrl =
    searchParams.get("redirect_url") ||
    process.env.NEXT_PUBLIC_DEFAULT_REDIRECT_URL ||
    "https://www.kawasan.digital";

  // Log redirect URL for debugging
  useEffect(() => {
    console.log('Redirect URL:', redirectUrl);
    console.log('Search Params:', Object.fromEntries(searchParams.entries()));
  }, [redirectUrl, searchParams]);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const authResult = await AuthService.getAuthToken(redirectUrl || "");

      if (
        authResult.redirect_url &&
        authResult.redirect_url !== `${redirectUrl}?token=null`
      ) {
        router.push(authResult.redirect_url);
        return;
      }
    };

    checkAuthAndRedirect();
  }, [router, redirectUrl]);

  useEffect(() => {
    if (
      !containerRef.current ||
      !loginFormRef.current ||
      !registerFormRef.current
    )
      return;

    const loginForm = loginFormRef.current;
    const registerForm = registerFormRef.current;

    // Reset initial state
    gsap.set(loginForm, { display: "block", opacity: 1 });
    gsap.set(registerForm, { display: "none", opacity: 0 });

    // Animation timeline
    const tl = gsap.timeline({ paused: true });

    tl.to(loginForm, {
      opacity: 0,
      display: "none",
      duration: 0.5,
      ease: "power2.inOut",
    }).to(
      registerForm,
      {
        display: "block",
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "-=0.25"
    );

    // Reverse animation
    const reverseTl = gsap.timeline({ paused: true });

    reverseTl
      .to(registerForm, {
        opacity: 0,
        display: "none",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        loginForm,
        {
          display: "block",
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.25"
      );

    // Toggle between login and register
    if (!isLogin) {
      tl.progress(1);
    } else {
      reverseTl.progress(1);
    }
  }, [isLogin]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        ref={containerRef}
        className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0"
      >
        <div className="absolute left-10 top-10">
          <Link
            href={redirectUrl}
            className="inline-flex items-center text-lg text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 gap-2 pointer-events-auto"
          >
            <CiCircleChevLeft size={25} />
            Back
          </Link>
        </div>
        <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center px-4">
          <Tabs
            value={!isLogin ? "register" : "login"}
            className="w-full max-w-md mx-auto"
            onValueChange={(value) => setIsLogin(value === "login")}
          >
            <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 w-full rounded-full">
              <TabsTrigger
                value="login"
                className="w-1/2 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-full"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="w-1/2 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:rounded-full"
              >
                Register
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div
            ref={loginFormRef}
            className="flex flex-col justify-center items-center w-full max-w-md"
            style={{
              display: isLogin ? "block" : "none",
              opacity: isLogin ? 1 : 0,
            }}
          >
            <LoginForm redirectUrl={redirectUrl} />
          </div>

          <div
            ref={registerFormRef}
            className="flex flex-col justify-center items-center w-full max-w-md"
            style={{
              display: !isLogin ? "block" : "none",
              opacity: !isLogin ? 1 : 0,
            }}
          >
            <RegisterForm
              onToggleForm={() => setIsLogin(true)}
              setIsLogin={setIsLogin}
            />
          </div>
        </div>

        <AuthWelcome isLogin={isLogin} />
      </div>
    </div>
  );
}
