"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================
// STATS CARD
// ============================================================

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  color?: "red" | "amber" | "emerald" | "sky" | "purple";
  suffix?: string;
}

const colorMap = {
  red: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    glow: "bg-red-500/30",
  },
  amber: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    glow: "bg-amber-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    glow: "bg-emerald-500/30",
  },
  sky: {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    glow: "bg-sky-500/30",
  },
  purple: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    glow: "bg-purple-500/30",
  },
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "red",
  suffix,
}: StatsCardProps) {
  const colors = colorMap[color];
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card relative overflow-hidden p-6"
    >
      <div
        className={cn(
          "absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl",
          colors.glow
        )}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {displayValue.toLocaleString()}
            {suffix}
          </p>
          {trend !== undefined && (
            <p
              className={cn(
                "mt-2 text-xs",
                trend >= 0 ? "text-emerald-300" : "text-rose-300"
              )}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={cn("rounded-2xl p-3", colors.bg, colors.text)}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// COMPLETION RING
// ============================================================

interface CompletionRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CompletionRing({
  value,
  size = 64,
  strokeWidth = 8,
  color = "text-red-400",
}: CompletionRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-slate-700"
          stroke="currentColor"
          fill="transparent"
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={color}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100">
        {value}%
      </span>
    </div>
  );
}

// ============================================================
// PROGRESS BAR
// ============================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  color = "from-red-500 via-red-400 to-amber-400",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const heights = { sm: "h-1", md: "h-2", lg: "h-3" };

  return (
    <div className="w-full">
      <div className={cn("w-full rounded-full bg-slate-800", heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "rounded-full bg-gradient-to-r",
            color,
            heights[size]
          )}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-xs text-slate-400">{percent.toFixed(0)}%</p>
      )}
    </div>
  );
}

// ============================================================
// BADGE
// ============================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
}

const badgeVariants = {
  default: "bg-slate-500/15 text-slate-300",
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  error: "bg-rose-500/15 text-rose-300",
  info: "bg-sky-500/15 text-sky-300",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        badgeVariants[variant]
      )}
    >
      {children}
    </span>
  );
}

// ============================================================
// BUTTON
// ============================================================

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const buttonVariants = {
  primary:
    "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25",
  secondary:
    "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
        buttonVariants[variant],
        buttonSizes[size],
        (disabled || loading) && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            className="opacity-75"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
}

// ============================================================
// INPUT
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500",
            "focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20",
            "transition-colors",
            error && "border-rose-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ============================================================
// SELECT
// ============================================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-slate-300">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm text-slate-100",
            "focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20",
            "transition-colors",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

// ============================================================
// CARD
// ============================================================

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
}

export function Card({
  children,
  hover = true,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn("glass-card p-6", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ============================================================
// AVATAR
// ============================================================

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const avatarSizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", avatarSizes[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-amber-500 font-semibold text-white",
        avatarSizes[size]
      )}
    >
      {initials}
    </div>
  );
}

// ============================================================
// SKELETON
// ============================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-800",
        className
      )}
    />
  );
}

// ============================================================
// TOOLTIP
// ============================================================

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-200 shadow-lg">
          {content}
        </div>
      </div>
    </div>
  );
}
