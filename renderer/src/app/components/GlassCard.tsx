import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-lg ${onClick ? "cursor-pointer hover:bg-white/[0.06] transition-colors" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
