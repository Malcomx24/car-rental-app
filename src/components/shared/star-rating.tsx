"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
}

const SIZE_MAP = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-7 w-7" };

export function StarRating({ value, onChange, size = "md", readonly = false, showValue = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const iconSize = SIZE_MAP[size];

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"
          )}
        >
          <Star
            className={cn(
              iconSize,
              (hovered || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
      {showValue && value > 0 && (
        <span className="text-sm font-medium ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
