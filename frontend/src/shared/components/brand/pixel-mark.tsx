import { cn } from "@/shared/lib/utils";

// 3×3 pixel grid; cells 2, 4 and 9 stay empty and the center is JS yellow.
const EMPTY_CELLS = new Set([1, 3, 8]);
const ACCENT_CELL = 4;

export function PixelMark({ className }: { className?: string }) {
  return (
    <span className={cn("pixel-mark", className)} aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <i
          key={index}
          className={cn(EMPTY_CELLS.has(index) && "is-empty", index === ACCENT_CELL && "is-accent")}
        />
      ))}
    </span>
  );
}
