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

export function resolveToolIcon(toolId: string): IconKey {
  return APPS.find((app) => app.id === toolId)?.icon ?? "sparkles";
}
