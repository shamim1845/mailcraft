"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useToast } from "../../ui/ToastProvider";

interface ImageUploadProps {
  label: string;
  onUpload: (dataUrl: string) => void;
  maxSize?: number;
  accept?: string;
}

const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2MB

export function ImageUpload({
  label,
  onUpload,
  maxSize = DEFAULT_MAX_SIZE,
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { notify } = useToast();

  const handleFile = async (file: File) => {
    if (file.size > maxSize) {
      notify(
        `${label} too large. Please use images under ${Math.round(
          maxSize / 1024 / 1024
        )}MB or use an external URL.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onUpload(dataUrl);
        notify(`${label} loaded successfully`);
        setIsLoading(false);
      };
      reader.onerror = () => {
        notify(`Failed to load ${label.toLowerCase()}`);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      notify(`Failed to process ${label.toLowerCase()}`);
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-600">{label}</label>
      <div
        className={`relative rounded-lg border-2 border-dashed transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          {isLoading ? (
            <>
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
              <p className="text-xs text-zinc-600">Uploading...</p>
            </>
          ) : (
            <>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200">
                <Upload className="h-5 w-5 text-zinc-600" />
              </div>
              <p className="mb-1 text-xs font-medium text-zinc-700">
                {isDragging
                  ? "Drop image here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-zinc-500">
                PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
        {!isLoading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 cursor-pointer"
            aria-label={`Upload ${label.toLowerCase()}`}
          />
        )}
      </div>
      <p className="text-xs text-zinc-400">
        Images are converted to base64 for export compatibility. For larger
        images, use an external URL.
      </p>
    </div>
  );
}

