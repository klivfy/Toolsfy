import { type IconKey } from "@/components/icons";

export type AppCategory = "web" | "extension" | "mobile-desktop";

export type Compatibility =
  | "web"
  | "chrome"
  | "edge"
  | "firefox"
  | "android"
  | "windows";

export type AppItem = {
  id: string;
  name: string;
  description: string;
  icon: IconKey;
  category: AppCategory;
  native: boolean;
  compatibility: Compatibility[];
  href: string;
};

export type StoreLink = {
  name: string;
  description: string;
  icon: IconKey;
  href: string;
};
