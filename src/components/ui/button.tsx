import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger" | "secondary";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "btn-primary-liquid text-white transform active:scale-95",
      secondary:
        "btn-secondary-liquid text-gray-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transform active:scale-95",
      outline:
        "border-2 border-indigo-200 dark:border-indigo-500/30 bg-transparent hover:border-indigo-500 dark:hover:border-indigo-500/70 hover:text-indigo-700 dark:hover:text-indigo-300 text-indigo-600 dark:text-indigo-400 transform active:scale-95",
      ghost:
        "bg-transparent hover:bg-indigo-50 dark:hover:bg-slate-800/50 text-indigo-700 dark:text-indigo-400 transform active:scale-95",
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm transform active:scale-95",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
