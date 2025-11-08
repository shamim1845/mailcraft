"use client";

import {
  Type,
  Image,
  MousePointerClick,
  Minus,
  SeparatorVertical,
  Circle,
  Share2,
  Columns2,
  Columns3,
  Menu,
  Layout,
  GripVertical,
} from "lucide-react";
import { useBuilderStore } from "../../lib/state/store";

// Groups of blocks
const groups = [
  {
    title: "Basic",
    items: [
      { key: "text", label: "Text", icon: Type },
      { key: "image", label: "Image", icon: Image },
      { key: "button", label: "Button", icon: MousePointerClick },
      { key: "divider", label: "Horizontal Line", icon: Minus },
      { key: "spacer", label: "Spacer", icon: SeparatorVertical },
      { key: "icon", label: "Icon", icon: Circle },
      { key: "social", label: "Social Icons", icon: Share2 },
    ],
  },
  {
    title: "Layout",
    items: [
      { key: "columns-2", label: "2 Columns", icon: Columns2 },
      { key: "columns-3", label: "3 Columns", icon: Columns3 },
    ],
  },
  {
    title: "Sections",
    items: [
      { key: "header", label: "Header", icon: Menu },
      { key: "footer", label: "Footer", icon: Layout },
    ],
  },
];

// Left panel component
export function LeftPanel() {
  const addBlock = useBuilderStore((s) => s.addBlock);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 px-1 pb-1">
        Component Library
      </div>
      {groups.map((g) => (
        <div key={g.title} className="flex flex-col gap-2">
          <div className="px-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            {g.title}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {g.items.map((it) => {
              const IconComponent = it.icon;
              return (
                <button
                  key={it.key}
                  className="group flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-2.5 text-sm transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm active:scale-[0.98]"
                  onClick={() => addBlock(it.key)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "application/x-mailcraft-block",
                      it.key
                    );
                    e.dataTransfer.effectAllowed = "copy";
                    // Add visual feedback
                    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
                  }}
                  title={`Drag or click to add ${it.label}`}
                >
                  <IconComponent className="h-4 w-4 shrink-0 text-zinc-600" />
                  <span className="flex-1 text-left">{it.label}</span>
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
