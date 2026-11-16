"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-[64px] rounded-lg bg-muted/20 border border-border/30" />
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selector"
      className="inline-flex items-center h-8 p-0.5 rounded-lg bg-muted/30 border border-border/50 text-muted-foreground"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = resolvedTheme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setTheme(opt.value)}
            title={`Switch to ${opt.label} mode`}
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer outline-none",
              isSelected
                ? "bg-background text-foreground shadow-xs font-medium border border-border/60"
                : "hover:text-foreground hover:bg-muted/30 text-muted-foreground/80"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="sr-only">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
