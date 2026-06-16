"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";
import { useToast } from "@/components/ui/toast-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Lock, Mail, Globe, Sun, Moon, LogIn } from "lucide-react";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  
  // Theme state
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; auth?: string }>({});

  useEffect(() => {
    setMounted(true);
    const getThemeResolution = () => {
      const saved = localStorage.getItem("theme") || "system";
      if (saved === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      return saved;
    };
    setCurrentTheme(getThemeResolution());
  }, []);

  const toggleTheme = () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("theme-change"));
  };

  const validate = () => {
    const result = loginSchema.safeParse({ email, password });
    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: { email?: string; password?: string } = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as "email" | "password";
      if (!newErrors[field]) {
        newErrors[field] = t(issue.message as any);
      }
    });

    setErrors(newErrors);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock verification
    if (email.toLowerCase() === "admin@scotiabank.com" && password === "admin123") {
      // Set session cookie (valid for 1 day)
      document.cookie = "auth_token=mock-jwt-session-token; path=/; max-age=86400; SameSite=Strict";
      
      toast(language === "en" ? "Welcome back!" : "¡Bienvenido de nuevo!", "success");
      
      // Redirect to dashboard
      router.push("/");
    } else {
      setErrors({
        auth: t("login.invalidCredentials")
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* Apple Liquid Glass Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/10 blur-[130px] animate-pulse pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] rounded-full bg-purple-400/15 dark:bg-purple-600/5 blur-[100px] pointer-events-none" />

      {/* Floating Toolbar (Language + Theme) */}
      <div className="absolute top-5 right-5 flex items-center gap-2 z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/30 rounded-2xl p-1.5 shadow-sm">
        {/* Language selector */}
        <button
          onClick={() => setLanguage(language === "es" ? "en" : "es")}
          className="rounded-xl px-3 py-1.5 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all cursor-pointer flex items-center gap-1.5"
          aria-label="Cambiar idioma"
          title={language === "es" ? "Switch to English" : "Cambiar a Español"}
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{language}</span>
        </button>

        <div className="h-4 w-[1px] bg-gray-200 dark:bg-slate-800" />

        {/* Theme selector */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer"
          aria-label="Cambiar tema"
        >
          {!mounted ? (
            <div className="h-4 w-4" />
          ) : currentTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-slate-800/30 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 sm:p-10 relative z-10 transition-all">
        <div className="flex flex-col items-center mb-8">
          {/* Logo Mark */}
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 transform hover:scale-105 transition-transform">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            {t("common.appName")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 text-center">
            {t("login.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Auth general errors */}
          {errors.auth && (
            <div className="p-3 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-950/40">
              {errors.auth}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("login.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`pl-11 rounded-xl h-11 border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 text-gray-950 dark:text-white transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("login.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <Input
                id="password"
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`pl-11 rounded-xl h-11 border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 text-gray-950 dark:text-white transition-all ${
                  errors.password ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl btn-primary-liquid font-bold text-white shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
            >
              <LogIn className="h-4.5 w-4.5" />
              {isLoading ? t("login.submitting") : t("login.submit")}
            </Button>
          </div>
        </form>

        {/* Mock Credentials Help Panel */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            {t("login.mockCredentials")}
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-4 py-2 rounded-xl bg-gray-50/80 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-900/50 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span>
              <strong>User:</strong> admin@scotiabank.com
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-slate-800">|</span>
            <span>
              <strong>Password:</strong> admin123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
