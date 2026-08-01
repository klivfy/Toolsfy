import {
  FileText,
  ImageIcon,
  MessageSquare,
  Sparkles,
  Puzzle,
  Smartphone,
  Monitor,
  Store,
  CirclePlay,
  Flame,
  Compass,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  "file-text": FileText,
  image: ImageIcon,
  "message-square": MessageSquare,
  sparkles: Sparkles,
  puzzle: Puzzle,
  smartphone: Smartphone,
  monitor: Monitor,
  store: Store,
  play: CirclePlay,
  flame: Flame,
  compass: Compass,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;
