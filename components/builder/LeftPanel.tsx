"use client";

import { useBuilderStore } from "../../lib/state/store";

const groups = [
  {
    title: "Basic",
    items: [
      { key: "text", label: "Text" },
      { key: "image", label: "Image" },
      { key: "button", label: "Button" },
      { key: "divider", label: "Horizontal Line" },
      { key: "spacer", label: "Spacer" },
      { key: "icon", label: "Icon" },
      { key: "social", label: "Social Icons" },
    ],
  },
  {
    title: "Layout",
    items: [
      { key: "columns-2", label: "2 Columns" },
      { key: "columns-3", label: "3 Columns" },
    ],
  },
  {
    title: "Sections",
    items: [
      { key: "header", label: "Header" },
      { key: "footer", label: "Footer" },
    ],
  },
];

export function LeftPanel() {
  const addBlock = useBuilderStore((s) => s.addBlock);
  return (
    <div className="flex h-full flex-col gap-4">
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-2">
          <div className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {g.title}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {g.items.map((it) => (
              <button
                key={it.key}
                className="flex items-center justify-between rounded border border-zinc-200 bg-white px-2 py-2 text-sm hover:border-zinc-300 hover:bg-zinc-50"
                onClick={() => addBlock(it.key)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "application/x-mailcraft-block",
                    it.key
                  );
                  // hint for OS ghost image
                  e.dataTransfer.effectAllowed = "copy";
                }}
              >
                <span>{it.label}</span>
                <span className="text-xs text-zinc-400">Add</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
