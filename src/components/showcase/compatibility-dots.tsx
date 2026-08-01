import { Globe } from "lucide-react";
import { type Compatibility } from "./types";

const COMPAT_LABEL: Record<Compatibility, string> = {
  web: "Web",
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  android: "Android",
  windows: "Windows",
};

export function CompatibilityDots({ items }: { items: Compatibility[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          title={COMPAT_LABEL[item]}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-200 text-[9px] font-medium uppercase text-zinc-500"
        >
          {item === "web" ? (
            <Globe className="h-3 w-3" strokeWidth={1.75} />
          ) : (
            COMPAT_LABEL[item][0]
          )}
        </span>
      ))}
    </div>
  );
}
