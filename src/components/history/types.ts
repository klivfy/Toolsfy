import { type IconKey } from "@/components/icons";

export type HistoryStatus = "success" | "error";

export type HistoryEntry = {
  id: string;
  toolName: string;
  icon: IconKey;
  timestamp: string;
  credits: number;
  status: HistoryStatus;
};
