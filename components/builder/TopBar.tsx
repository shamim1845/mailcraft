"use client";

import { useEffect } from "react";
import { useBuilderStore } from "../../lib/state/store";
import { renderTemplateToHtml } from "../../lib/export/renderEmail";
import { downloadHtmlFile } from "../../lib/export/download";
import { openPreview } from "../../lib/export/preview";
import { copyHtmlToClipboard } from "../../lib/export/clipboard";
import { useToast } from "../ui/ToastProvider";

export function TopBar() {
  const name = useBuilderStore((s) => s.history.present.name);
  const viewport = useBuilderStore((s) => s.viewport);
  const setViewport = useBuilderStore((s) => s.setViewport);
  const updateName = useBuilderStore((s) => s.updateName);
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const saveLocal = useBuilderStore((s) => s.saveLocal);
  const loadLocal = useBuilderStore((s) => s.loadLocal);
  const template = useBuilderStore((s) => s.history.present);
  const { notify } = useToast();

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  return (
    <div className="flex items-center gap-3 border-b border-zinc-200 bg-white/80 px-3 py-2 backdrop-blur supports-backdrop-filter:bg-white/60">
      <input
        value={name}
        onChange={(e) => updateName(e.target.value)}
        className="min-w-0 rounded border border-zinc-200 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
        aria-label="Template name"
      />
      <div className="mx-2 h-6 w-px bg-zinc-200" />
      <div className="flex items-center gap-2">
        <button
          className={`rounded px-2 py-1 text-sm ${
            viewport === "desktop"
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200"
          }`}
          onClick={() => setViewport("desktop")}
        >
          Desktop
        </button>
        <button
          className={`rounded px-2 py-1 text-sm ${
            viewport === "mobile"
              ? "bg-zinc-900 text-white"
              : "border border-zinc-200"
          }`}
          onClick={() => setViewport("mobile")}
        >
          Mobile
        </button>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-sm"
          onClick={undo}
        >
          Undo
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-sm"
          onClick={redo}
        >
          Redo
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-sm"
          onClick={() => {
            const html = renderTemplateToHtml(template);
            openPreview(html);
            notify("Opened preview in new tab");
          }}
        >
          Preview
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-sm"
          onClick={async () => {
            const html = renderTemplateToHtml(template);
            const ok = await copyHtmlToClipboard(html);
            notify(ok ? "Copied HTML to clipboard" : "Copy failed");
          }}
        >
          Copy HTML
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-sm"
          onClick={saveLocal}
        >
          Save
        </button>
        <button
          className="rounded bg-zinc-900 px-3 py-1 text-sm text-white"
          onClick={() => {
            const html = renderTemplateToHtml(template);
            downloadHtmlFile(template.name || "email", html);
            notify("Downloaded HTML file");
          }}
        >
          Export HTML
        </button>
      </div>
    </div>
  );
}
