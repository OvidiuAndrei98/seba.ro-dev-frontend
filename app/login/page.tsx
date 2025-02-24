"use client";

import { LoginPageProps } from "@/lib/types";
import LoginForm from "./components/LoginForm";

// import "./Login.css";

export default function LoginPage({ params }: LoginPageProps) {
  return (
    <div className="bg-slate-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-slate-800">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm
          params={{ onLogin: params.onLogin, loggingIn: params.loggingIn }}
        />
      </div>
    </div>
  );
}
