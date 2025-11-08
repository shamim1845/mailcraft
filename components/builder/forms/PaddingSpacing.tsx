"use client";

type PaddingValue =
  | { top: number; right: number; bottom: number; left: number }
  | { top: number; bottom: number };

interface PaddingSpacingProps {
  label: string;
  value: PaddingValue;
  onChange: (value: PaddingValue) => void;
}

export function PaddingSpacing({
  label,
  value,
  onChange,
}: PaddingSpacingProps) {
  const isFullPadding = "right" in value && "left" in value;
  const sides = isFullPadding
    ? (["top", "right", "bottom", "left"] as const)
    : (["top", "bottom"] as const);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-600">{label}</label>
      <div
        className={`grid gap-2 ${
          isFullPadding ? "grid-cols-4" : "grid-cols-2"
        }`}
      >
        {sides.map((side) => {
          let currentValue: number;
          if (isFullPadding) {
            const fullValue = value as {
              top: number;
              right: number;
              bottom: number;
              left: number;
            };
            currentValue = fullValue[side];
          } else {
            const partialValue = value as { top: number; bottom: number };
            currentValue = partialValue[side as "top" | "bottom"];
          }

          return (
            <div key={side} className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 capitalize">{side}</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1.5 text-sm focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
                value={currentValue}
                onChange={(e) => {
                  const numValue = Number(e.target.value) || 0;
                  onChange({
                    ...value,
                    [side]: numValue,
                  } as PaddingValue);
                }}
                min="0"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
