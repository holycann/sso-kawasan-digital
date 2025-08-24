import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSO Kawasan Digital",
  description: "Secure Single Sign-On Platform",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToastProvider position="bottom-right">
          <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-50">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          }>
            {children}
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
