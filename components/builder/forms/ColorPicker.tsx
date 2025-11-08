"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  startTransition,
} from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const DEBOUNCE_DELAY = 150; // milliseconds

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const initialValue = value || "#000000";
  const [localColor, setLocalColor] = useState(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastCommittedValueRef = useRef(initialValue);
  const previousValueRef = useRef(initialValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when prop value changes externally (e.g., undo/redo)
  useEffect(() => {
    if (value !== previousValueRef.current) {
      const newValue = value || "#000000";
      // Use startTransition to mark this as a non-urgent update
      startTransition(() => {
        setLocalColor(newValue);
      });
      lastCommittedValueRef.current = newValue;
      previousValueRef.current = newValue;

      // Clear any pending debounced updates
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    }
  }, [value]);

  // Debounced onChange callback
  const debouncedOnChange = useCallback(
    (newColor: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(newColor);
        lastCommittedValueRef.current = newColor;
        debounceTimerRef.current = null;
      }, DEBOUNCE_DELAY);
    },
    [onChange]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This fires continuously while dragging the color picker
    const newColor = e.target.value;
    setLocalColor(newColor); // Update local state immediately for smooth preview
    debouncedOnChange(newColor); // Debounce global state update
  };

  const handleColorMouseUp = () => {
    // Commit immediately when user releases mouse (end of drag)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onChange(localColor);
    lastCommittedValueRef.current = localColor;
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setLocalColor(hex); // Update local state immediately
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      // For valid hex, debounce the update
      debouncedOnChange(hex);
    }
  };

  const handleHexBlur = () => {
    // Clear any pending debounced updates
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (/^#[0-9A-F]{6}$/i.test(localColor)) {
      // Commit immediately on blur
      onChange(localColor);
      lastCommittedValueRef.current = localColor;
    } else {
      // Reset to last valid value if invalid
      const validValue = lastCommittedValueRef.current || "#000000";
      setLocalColor(validValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-600">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <div
            className="h-10 w-full cursor-pointer rounded border-2 border-zinc-200 transition-all hover:border-zinc-400 group-hover:shadow-sm"
            style={{ backgroundColor: localColor }}
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            ref={fileInputRef}
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            value={/^#[0-9A-F]{6}$/i.test(localColor) ? localColor : "#000000"}
            onChange={handleColorChange}
            onMouseUp={handleColorMouseUp}
          />
        </div>
        <input
          type="text"
          className="w-24 rounded border border-zinc-200 bg-white px-2.5 py-2 text-xs font-mono text-zinc-700 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
          value={localColor}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          placeholder="#000000"
          pattern="^#[0-9A-F]{6}$"
        />
      </div>
    </div>
  );
}
