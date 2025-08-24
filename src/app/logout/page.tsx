"use client";

import React, { useRef, useEffect } from "react";
import { AuthService } from "@/services/authService";
import { useToastContext } from "@/providers/toast-provider";
import { gsap } from "gsap";
import { FaSignOutAlt, FaSpinner } from "react-icons/fa";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

export default function LogoutPage() {
  const searchParams = useSearchParams();
  const { toast } = useToastContext();

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const logoutContentRef = useRef<HTMLDivElement>(null);

  // Default redirect if not provided
  const redirectUrl = searchParams.get("redirect_url")
    ? `/?redirect_url=${searchParams.get("redirect_url")}`
    : "/";

  useEffect(() => {
    // Check if access_token exists in cookie
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      // Delay 2 seconds before proceeding
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);

      return;
    }

    let animationCleanup: gsap.core.Tween | null = null;

    // GSAP entrance animation
    if (containerRef.current && logoutContentRef.current) {
      animationCleanup = gsap.fromTo(
        logoutContentRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }

    // Logout process
    async function performLogout() {
      try {
        // Animate spinner
        if (logoutContentRef.current) {
          gsap.to(logoutContentRef.current.querySelector(".spinner"), {
            rotation: 360,
            repeat: -1,
            duration: 1,
            ease: "linear",
          });
        }

        // Attempt logout
        const logoutResult = await AuthService.logout();

        if (logoutResult.success) {
          // Success toast
          toast({
            title: "Logout Berhasil",
            description: logoutResult.message,
            variant: "success",
          });

          // Animate exit
          if (logoutContentRef.current) {
            gsap.to(logoutContentRef.current, {
              opacity: 0,
              scale: 0.9,
              y: 50,
              duration: 0.5,
              onComplete: () => {
                // Redirect after animation with page refresh
                window.location.href = redirectUrl;
              },
            });
          } else {
            // Fallback redirect if animation fails
            window.location.href = redirectUrl;
          }
        } else {
          // Error toast
          toast({
            title: "Logout Gagal",
            description: logoutResult.message,
            variant: "error",
          });

          // Show error state
          if (logoutContentRef.current) {
            gsap.to(logoutContentRef.current, {
              backgroundColor: "#FEE2E2",
              duration: 0.3,
            });
          }

          // Fallback redirect
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000);
        }
      } catch (error) {
        // Unexpected error handling
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat logout",
          variant: "error",
        });

        // Show error state
        if (logoutContentRef.current) {
          gsap.to(logoutContentRef.current, {
            backgroundColor: "#FEE2E2",
            duration: 0.3,
          });
        }

        // Fallback redirect
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 3000);
      }
    }

    performLogout();

    // Cleanup animation on unmount
    return () => {
      if (animationCleanup) {
        animationCleanup.kill();
      }
    };
  }, [redirectUrl, toast]);

  return (
    <div
      ref={containerRef}
      className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0"
    >
      <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 lg:w-1/2 w-full items-center justify-center px-4">
          <div
            ref={logoutContentRef}
            className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="spinner mb-6 w-20 h-20 flex items-center justify-center">
                <FaSpinner className="text-blue-500 text-5xl animate-spin" />
              </div>

              <div className="mb-6">
                <FaSignOutAlt className="mx-auto text-6xl text-blue-600 opacity-70 dark:text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                Logout Sedang Diproses
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Mohon tunggu sebentar. Anda akan dialihkan ke halaman utama.
              </p>

              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Jika proses berlangsung terlalu lama, silakan refresh halaman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
