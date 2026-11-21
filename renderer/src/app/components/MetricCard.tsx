import React from "react";
import { GlassCard } from "./GlassCard";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function MetricCard({ title, value, icon: Icon, trend, trendUp, color = "text-blue" }: MetricCardProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[0.8125rem] text-muted-foreground">{title}</p>
          <p className="text-[1.75rem] tracking-tight text-foreground">{value}</p>
          {trend && (
            <p className={`text-[0.75rem] ${trendUp ? "text-green" : "text-red"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg bg-white/[0.04] ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </GlassCard>
  );
}
