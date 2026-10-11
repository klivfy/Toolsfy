import { APPS } from "@/components/showcase/data";
import { type IconKey } from "@/components/icons";

export type ToolUsageRow = {
  id: string;
  tool_id: string;
  tool_name: string;
  credits: number;
  status: "success" | "error";
  created_at: string;
};

/** Row returned by the get_monthly_usage() database function. */
export type MonthlyUsage = {
  credits_used: number;
  executions: number;
  successes: number;
};

export const CREDITS_LIMIT_FREE = 100;
export const CREDITS_LIMIT_PREMIUM = 1000;

export function getCreditsLimit(isPremium: boolean) {
  return isPremium ? CREDITS_LIMIT_PREMIUM : CREDITS_LIMIT_FREE;
}

export function resolveToolIcon(toolId: string): IconKey {
  return APPS.find((app) => app.id === toolId)?.icon ?? "sparkles";
}
