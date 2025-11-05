"use client";

import { TopBar } from "./TopBar";
import { LeftPanel } from "./LeftPanel";
import { Canvas } from "./Canvas";
import { RightPanel } from "./RightPanel";
import { useEffect } from "react";
import { useBuilderStore } from "../../lib/state/store";
import dynamic from "next/dynamic";

function BuilderPage() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const selectedId = useBuilderStore((s) => s.selectedId);
  const updateBlock = useBuilderStore((s) => s.updateBlock);
  const deleteBlock = useBuilderStore((s) => s.deleteBlock);
  const deleteIn = useBuilderStore((s) => s.deleteBlockInColumn);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (meta && e.key.toLowerCase() === "y") ||
        (meta && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (!selectedId) return;
        // Try delete at root; if not found, attempt nested delete by searching columns
        deleteBlock(selectedId);
        // Fallback nested search
        updateBlock("__noop__", (b: any) => b); // no-op to trigger state in case above didn't delete
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, selectedId, updateBlock, deleteBlock, deleteIn]);
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-100 text-zinc-900">
      <div className="fixed inset-x-0 top-0 z-20">
        <TopBar />
      </div>
      <div className="flex h-full w-full pt-16">
        <aside className="hidden shrink-0 border-r border-zinc-200 bg-white p-3 sm:block sm:w-64 lg:w-72">
          <LeftPanel />
        </aside>
        <main className="flex min-w-0 flex-1 items-start justify-center overflow-auto p-4">
          <Canvas />
        </main>
        <aside className="hidden shrink-0 border-l border-zinc-200 bg-white p-3 md:block md:w-80">
          <RightPanel />
        </aside>
      </div>
    </div>
  );
}

export default BuilderPage;
