import React from "react";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning" | "active" | "idle";
  label: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

const colorMap = {
  online: "bg-green",
  active: "bg-green",
  offline: "bg-red",
  warning: "bg-yellow",
  idle: "bg-muted-foreground",
};

const glowMap = {
  online: "shadow-[0_0_8px_rgba(16,185,129,0.6)]",
  active: "shadow-[0_0_8px_rgba(16,185,129,0.6)]",
  offline: "shadow-[0_0_8px_rgba(239,68,68,0.6)]",
  warning: "shadow-[0_0_8px_rgba(245,158,11,0.6)]",
  idle: "",
};

const sizeMap = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" };

export function StatusIndicator({ status, label, size = "md", pulse = true }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`relative inline-block rounded-full ${sizeMap[size]} ${colorMap[status]} ${glowMap[status]}`}>
        {pulse && (status === "online" || status === "active") && (
          <span className={`absolute inset-0 rounded-full ${colorMap[status]} animate-ping opacity-40`} />
        )}
      </span>
      <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
    </div>
  );
}
