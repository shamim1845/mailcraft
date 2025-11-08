"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import {
  GripVertical,
  Edit,
  Copy,
  Trash2,
  Circle,
  Square,
  Star,
} from "lucide-react";

import {
  Block,
  ColumnsBlock,
  HeaderBlock,
  FooterBlock,
  IconBlock,
} from "../../lib/schema/block";
import { SocialIcon } from "./SocialIcons";

import { useBuilderStore } from "../../lib/state/store";

function SortableBlockShell({
  block,
  selected,
  onSelect,
  onDelete,
  onDuplicate,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  } as React.CSSProperties;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded border bg-white transition-all ${
        selected
          ? "border-zinc-900 shadow-md"
          : "border-zinc-200 hover:border-zinc-400"
      } ${isDragging ? "cursor-grabbing" : "cursor-default"}`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 flex h-full w-6 cursor-grab items-center justify-center rounded-l border-r border-zinc-200 bg-zinc-50 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4 text-zinc-400" />
      </div>
      {/* Action buttons */}
      <div className="absolute right-2 top-2 z-10 hidden gap-1 group-hover:flex">
        <button
          className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm transition-colors hover:bg-zinc-50"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          title="Edit"
        >
          <Edit className="h-3 w-3" />
        </button>
        <button
          className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm transition-colors hover:bg-zinc-50"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate"
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-600 shadow-sm transition-colors hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="p-3 pl-9 cursor-pointer" onClick={onSelect}>
        <BlockPreview block={block} />
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <div
          dangerouslySetInnerHTML={{ __html: block.html }}
          style={{
            fontFamily: block.fontFamily,
            fontSize: `${block.fontSize}px`,
            color: block.color,
            textAlign: block.align,
            padding: `${block.padding.top}px ${block.padding.right}px ${block.padding.bottom}px ${block.padding.left}px`,
          }}
        />
      );
    case "image":
      const imgElement = (
        <Image
          src={block.url}
          alt={block.alt}
          unoptimized
          width={600}
          height={300}
          style={{
            width: block.width,
            height: block.height === "auto" ? "auto" : block.height,
            pointerEvents: "none",
            display: "block",
          }}
        />
      );
      return (
        <div
          style={{
            textAlign:
              block.align === "center"
                ? "center"
                : block.align === "right"
                ? "right"
                : "left",
            padding: `${block.padding.top}px ${block.padding.right}px ${block.padding.bottom}px ${block.padding.left}px`,
          }}
        >
          {block.link ? (
            <a href={block.link} style={{ pointerEvents: "auto" }}>
              {imgElement}
            </a>
          ) : (
            imgElement
          )}
        </div>
      );
    case "button":
      const full = block.align === "full";
      return (
        <div
          style={{
            textAlign: full
              ? "center"
              : block.align === "center"
              ? "center"
              : block.align === "right"
              ? "right"
              : "left",
            padding: 0,
          }}
        >
          <a
            href={block.url}
            style={{
              background: block.bg,
              color: block.color,
              textDecoration: "none",
              borderRadius: `${block.radius}px`,
              fontSize: `${block.fontSize}px`,
              display: full ? "block" : "inline-block",
              width: full ? "100%" : "auto",
              textAlign: full ? "center" : "center",
              padding: `${block.paddingV}px ${block.paddingH}px`,
            }}
          >
            {block.text}
          </a>
        </div>
      );
    case "divider":
      return (
        <div
          style={{
            padding: `${block.padding.top}px 0 ${block.padding.bottom}px 0`,
          }}
        >
          <div
            style={{
              borderTop: `${block.thickness}px ${block.style} ${block.color}`,
              height: 0,
              margin: 0,
            }}
          />
        </div>
      );
    case "spacer":
      return (
        <div
          style={{
            height: block.height,
            lineHeight: `${block.height}px`,
            fontSize: 0,
          }}
        >
          &nbsp;
        </div>
      );
    case "social":
      return (
        <div
          style={{
            textAlign:
              block.align === "center"
                ? "center"
                : block.align === "right"
                ? "right"
                : "left",
            padding: "8px 0",
          }}
        >
          {block.platforms.map((p) => (
            <a
              key={p.key}
              href={p.url}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                width: block.size,
                height: block.size,
                marginRight: `${block.gap}px`,
                display: "inline-block",
              }}
            >
              <SocialIcon platform={p.key} size={block.size} />
            </a>
          ))}
        </div>
      );
    case "columns":
      return <ColumnsPreview block={block as ColumnsBlock} />;
    case "icon": {
      const iconBlock = block as IconBlock;
      const iconType = iconBlock.icon || "circle";
      const size = iconBlock.size || 24;
      const color = iconBlock.color || "#6b7280";
      const IconComponent =
        iconType === "square" ? Square : iconType === "star" ? Star : Circle;
      const content = (
        <IconComponent
          size={size}
          fill={color}
          stroke={color}
          className="inline-block"
        />
      );
      return (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          {iconBlock.url ? (
            <a
              href={iconBlock.url}
              className="inline-block transition-opacity hover:opacity-80"
              style={{ textDecoration: "none" }}
            >
              {content}
            </a>
          ) : (
            <div className="inline-block">{content}</div>
          )}
        </div>
      );
    }
    case "header": {
      const headerBlock = block as HeaderBlock;
      const logoWidth = headerBlock.logoWidth ?? 200; // default max width
      const logoHeight = headerBlock.logoHeight;
      return (
        <div
          className="flex items-center justify-between gap-4"
          style={{
            background: headerBlock.bg ?? "transparent",
            color: headerBlock.color ?? "inherit",
            padding: `${headerBlock.padding.top}px ${headerBlock.padding.right}px ${headerBlock.padding.bottom}px ${headerBlock.padding.left}px`,
          }}
        >
          <div className="shrink-0" style={{ maxWidth: `${logoWidth}px` }}>
            {headerBlock.logoUrl ? (
              <Image
                src={headerBlock.logoUrl || ""}
                alt="logo"
                unoptimized
                width={600}
                height={300}
                style={{
                  width: "100%",
                  height: logoHeight ? `${logoHeight}px` : "auto",
                  maxWidth: `${logoWidth}px`,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div className="text-sm">Logo</div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm shrink-0">
            {headerBlock.menu.map((m) => (
              <a
                key={m.id}
                href={m.url}
                className="hover:underline whitespace-nowrap"
              >
                {m.text}
              </a>
            ))}
          </div>
        </div>
      );
    }
    case "footer": {
      const footerBlock = block as FooterBlock;
      const padding = footerBlock.padding || {
        top: 12,
        right: 12,
        bottom: 12,
        left: 12,
      };
      return (
        <div
          className="text-center text-xs"
          style={{
            background: footerBlock.bg ?? "transparent",
            color: footerBlock.color ?? "inherit",
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          }}
        >
          <div className="font-medium">{footerBlock.company}</div>
          {footerBlock.address && (
            <div className="opacity-70">{footerBlock.address}</div>
          )}
          <div className="mt-2 flex justify-center gap-3">
            {footerBlock.socials.map((s, i: number) => (
              <a
                key={i}
                href={s.url}
                className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
              >
                <SocialIcon platform={s.key} size={24} />
              </a>
            ))}
          </div>
          {footerBlock.unsubscribeText && (
            <div className="mt-2 opacity-70">{footerBlock.unsubscribeText}</div>
          )}
          {footerBlock.copyright && (
            <div className="mt-2 opacity-70">{footerBlock.copyright}</div>
          )}
        </div>
      );
    }
    default:
      return <div className="text-xs text-zinc-500">Unsupported block</div>;
  }
}

function ColumnDropZone({
  blocks,
  onDrop,
  children,
}: {
  blocks: Block[];
  onDrop: (key: string, index: number) => void;
  children: React.ReactNode;
}) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("application/x-mailcraft-block")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation(); // Stop propagation to parent
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const blockElements = container.querySelectorAll(
      "[data-column-block-index]"
    );

    if (blockElements.length === 0) {
      setDragOverIndex(0);
      return;
    }

    let targetIndex = blocks.length;

    blockElements.forEach((blockEl, idx) => {
      const blockRect = blockEl.getBoundingClientRect();
      const blockTop = blockRect.top - rect.top;
      const blockHeight = blockRect.height;
      const blockCenter = blockTop + blockHeight / 2;

      if (y >= blockTop && y < blockCenter) {
        targetIndex = idx;
      } else if (y >= blockCenter && y < blockTop + blockHeight) {
        targetIndex = idx + 1;
      }
    });

    const firstBlock = blockElements[0];
    if (firstBlock) {
      const firstRect = firstBlock.getBoundingClientRect();
      const firstTop = firstRect.top - rect.top;
      if (y < firstTop) {
        targetIndex = 0;
      }
    }

    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const container = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!container.contains(relatedTarget)) {
      setIsDragging(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    const key = e.dataTransfer.getData("application/x-mailcraft-block");
    if (key && dragOverIndex !== null) {
      e.preventDefault();
      e.stopPropagation(); // Stop propagation to parent
      onDrop(key, dragOverIndex);
    }
    setIsDragging(false);
    setDragOverIndex(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100px]"
      data-column-drop-zone
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && dragOverIndex !== null && (
        <ColumnDropIndicator
          blocks={blocks}
          insertIndex={dragOverIndex}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}

function ColumnDropIndicator({
  blocks,
  insertIndex,
  containerRef,
}: {
  blocks: Block[];
  insertIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    top: number;
    display: string;
  }>({ top: 0, display: "none" });

  React.useEffect(() => {
    if (!containerRef.current || insertIndex === null) {
      setIndicatorStyle({ top: 0, display: "none" });
      return;
    }

    const container = containerRef.current;
    const blockElements = container.querySelectorAll(
      "[data-column-block-index]"
    );

    let top = 0;

    if (insertIndex === 0) {
      if (blockElements.length > 0) {
        const firstBlock = blockElements[0] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const blockRect = firstBlock.getBoundingClientRect();
        top = blockRect.top - containerRect.top - 2;
      } else {
        top = 0;
      }
    } else if (insertIndex <= blocks.length) {
      const targetBlock = blockElements[insertIndex - 1] as HTMLElement;
      if (targetBlock) {
        const containerRect = container.getBoundingClientRect();
        const blockRect = targetBlock.getBoundingClientRect();
        top = blockRect.bottom - containerRect.top + 2;
      } else if (blockElements.length > 0) {
        const lastBlock = blockElements[
          blockElements.length - 1
        ] as HTMLElement;
        if (lastBlock) {
          const containerRect = container.getBoundingClientRect();
          const blockRect = lastBlock.getBoundingClientRect();
          top = blockRect.bottom - containerRect.top + 2;
        }
      }
    }

    setIndicatorStyle({ top, display: "block" });
  }, [insertIndex, blocks.length, containerRef]);

  if (indicatorStyle.display === "none") return null;

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-10"
      style={{
        top: `${indicatorStyle.top}px`,
        display: indicatorStyle.display,
      }}
    >
      <DropIndicator show={true} />
    </div>
  );
}

function ColumnsPreview({ block }: { block: ColumnsBlock }) {
  const selectedId = useBuilderStore((s) => s.selectedId);
  const select = useBuilderStore((s) => s.select);
  const duplicateIn = useBuilderStore((s) => s.duplicateBlockInColumn);
  const deleteIn = useBuilderStore((s) => s.deleteBlockInColumn);
  const moveIn = useBuilderStore((s) => s.moveBlockInColumns);
  const addIn = useBuilderStore((s) => s.addBlockToColumn);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const a = active.data.current as
      | { container: string; index: number }
      | undefined;
    const o = over.data.current as
      | { container: string; index: number }
      | undefined;
    if (!a || !o) return;
    if (a.container === o.container && a.container.startsWith("col:")) {
      if (a.index === o.index) return;
      const [, colStr] = a.container.split(":");
      const colIdx = Number(colStr);
      moveIn(block.id, colIdx, a.index, colIdx, o.index);
    } else if (
      a.container.startsWith("col:") &&
      o.container.startsWith("col:")
    ) {
      const [, fromStr] = a.container.split(":");
      const [, toStr] = o.container.split(":");
      moveIn(block.id, Number(fromStr), a.index, Number(toStr), o.index);
    }
  }

  return (
    <div
      className="w-full"
      style={{
        background: block.background,
        padding: `${block.padding.top}px ${block.padding.right}px ${block.padding.bottom}px ${block.padding.left}px`,
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (
          target === e.currentTarget ||
          target.closest('[class*="Empty column"]') ||
          (target.classList.contains("flex") && !target.closest(".group"))
        ) {
          select(block.id);
        }
      }}
      onDragOver={(e) => {
        // Prevent root level drop zone from interfering
        if (e.dataTransfer.types.includes("application/x-mailcraft-block")) {
          e.stopPropagation();
        }
      }}
    >
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex" style={{ gap: block.gap }}>
          {block.columns.map(
            (col: { id: string; children: Block[] }, idx: number) => (
              <div
                key={col.id}
                style={{ flex: `${block.widths[idx] ?? 1}` }}
                onDragOver={(e) => {
                  // Stop propagation to prevent root level from handling
                  if (
                    e.dataTransfer.types.includes(
                      "application/x-mailcraft-block"
                    )
                  ) {
                    e.stopPropagation();
                  }
                }}
              >
                <ColumnDropZone
                  blocks={col.children}
                  onDrop={(key, index) => addIn(block.id, idx, key, index)}
                >
                  <SortableContext
                    items={col.children.map((c: Block) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-3">
                      {col.children.length === 0 && (
                        <div className="rounded border border-dashed border-zinc-300 p-3 text-center text-xs text-zinc-400">
                          Empty column
                        </div>
                      )}
                      {col.children.map((child: Block, i: number) => (
                        <div key={child.id} data-column-block-index={i}>
                          <SortableItem
                            id={child.id}
                            container={`col:${idx}`}
                            index={i}
                          >
                            {({ attributes, listeners, setNodeRef, style }) => (
                              <div
                                ref={setNodeRef}
                                style={style}
                                className={`group relative rounded border bg-white transition-all ${
                                  selectedId === child.id
                                    ? "border-zinc-900 shadow-md"
                                    : "border-zinc-200 hover:border-zinc-400"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                {/* Drag handle */}
                                <div
                                  {...attributes}
                                  {...listeners}
                                  className="absolute left-0 top-0 flex h-full w-6 cursor-grab items-center justify-center rounded-l border-r border-zinc-200 bg-zinc-50 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="h-4 w-4 text-zinc-400" />
                                </div>
                                {/* Action buttons */}
                                <div className="absolute right-2 top-2 z-10 hidden gap-1 group-hover:flex">
                                  <button
                                    className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm transition-colors hover:bg-zinc-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      select(child.id);
                                    }}
                                    title="Edit"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs shadow-sm transition-colors hover:bg-zinc-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateIn(block.id, idx, child.id);
                                    }}
                                    title="Duplicate"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                  <button
                                    className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-600 shadow-sm transition-colors hover:bg-red-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteIn(block.id, idx, child.id);
                                    }}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                                <div
                                  className="p-3 pl-9 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    select(child.id);
                                  }}
                                >
                                  <BlockPreview block={child} />
                                </div>
                              </div>
                            )}
                          </SortableItem>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </ColumnDropZone>
              </div>
            )
          )}
        </div>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  container,
  index,
  children,
}: {
  id: string;
  container: string;
  index: number;
  children: (props: {
    attributes: React.HTMLAttributes<HTMLElement>;
    listeners: any;
    setNodeRef: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
  }) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { container, index } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return <>{children({ attributes, listeners, setNodeRef, style })}</>;
}

function DropIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="relative h-0.5 w-full">
      <div className="absolute inset-0 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
    </div>
  );
}

// Single container-based drop zone that calculates insertion index dynamically
function SingleDropZoneContainer({
  blocks,
  onDrop,
  children,
}: {
  blocks: Block[];
  onDrop: (key: string, index: number) => void;
  children: React.ReactNode;
}) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("application/x-mailcraft-block")) {
      return;
    }

    // Don't handle if dragging over a column (let column handle it)
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-column-block-index]") ||
      target.closest("[data-column-drop-zone]")
    ) {
      // Always clear root indicator when dragging over columns
      setIsDragging(false);
      setDragOverIndex(null);
      return;
    }

    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);

    // Calculate which block the mouse is over
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Get all block elements (excluding column children)
    const blockElements = container.querySelectorAll("[data-block-index]");

    // Handle empty container
    if (blockElements.length === 0) {
      setDragOverIndex(0);
      return;
    }

    let targetIndex = blocks.length; // Default to end

    blockElements.forEach((blockEl, idx) => {
      const blockRect = blockEl.getBoundingClientRect();
      const blockTop = blockRect.top - rect.top;
      const blockHeight = blockRect.height;
      const blockCenter = blockTop + blockHeight / 2;

      // If mouse is in the upper half of a block, insert before it
      if (y >= blockTop && y < blockCenter) {
        targetIndex = idx;
      }
      // If mouse is in the lower half of a block, insert after it
      else if (y >= blockCenter && y < blockTop + blockHeight) {
        targetIndex = idx + 1;
      }
    });

    // Check if we're before the first block
    const firstBlock = blockElements[0];
    const firstRect = firstBlock.getBoundingClientRect();
    const firstTop = firstRect.top - rect.top;
    if (y < firstTop) {
      targetIndex = 0;
    }

    setDragOverIndex(targetIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the container itself, not a child
    const container = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    // Also clear if entering a column drop zone
    if (relatedTarget?.closest("[data-column-drop-zone]")) {
      setIsDragging(false);
      setDragOverIndex(null);
      return;
    }

    if (!container.contains(relatedTarget)) {
      setIsDragging(false);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    // Check if drop was handled by a column first
    const target = e.target as HTMLElement;
    if (target.closest("[data-column-drop-zone]")) {
      // Drop was handled by column, clear state and don't process here
      setIsDragging(false);
      setDragOverIndex(null);
      return;
    }

    // Always clear state
    setIsDragging(false);
    const currentIndex = dragOverIndex;
    setDragOverIndex(null);

    const key = e.dataTransfer.getData("application/x-mailcraft-block");
    if (key && currentIndex !== null) {
      e.preventDefault();
      e.stopPropagation();
      onDrop(key, currentIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {/* Render drop indicators */}
      {isDragging && dragOverIndex !== null && (
        <DropIndicatorContainer
          blocks={blocks}
          insertIndex={dragOverIndex}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}

function DropIndicatorContainer({
  blocks,
  insertIndex,
  containerRef,
}: {
  blocks: Block[];
  insertIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    top: number;
    display: string;
  }>({ top: 0, display: "none" });

  React.useEffect(() => {
    if (!containerRef.current || insertIndex === null) {
      setIndicatorStyle({ top: 0, display: "none" });
      return;
    }

    const container = containerRef.current;
    const blockElements = container.querySelectorAll("[data-block-index]");

    let top = 0;

    if (insertIndex === 0) {
      // Show indicator before first block (or at top if empty)
      if (blockElements.length > 0) {
        const firstBlock = blockElements[0] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const blockRect = firstBlock.getBoundingClientRect();
        top = blockRect.top - containerRect.top - 2;
      } else {
        // Empty container - show at top
        top = 0;
      }
    } else if (insertIndex <= blocks.length) {
      // Show indicator after a block
      const targetBlock = blockElements[insertIndex - 1] as HTMLElement;
      if (targetBlock) {
        const containerRect = container.getBoundingClientRect();
        const blockRect = targetBlock.getBoundingClientRect();
        top = blockRect.bottom - containerRect.top + 2;
      } else if (blockElements.length > 0) {
        // Fallback: position at end
        const lastBlock = blockElements[
          blockElements.length - 1
        ] as HTMLElement;
        if (lastBlock) {
          const containerRect = container.getBoundingClientRect();
          const blockRect = lastBlock.getBoundingClientRect();
          top = blockRect.bottom - containerRect.top + 2;
        }
      }
    }

    setIndicatorStyle({ top, display: "block" });
  }, [insertIndex, blocks.length, containerRef]);

  if (indicatorStyle.display === "none") return null;

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none z-10"
      style={{
        top: `${indicatorStyle.top}px`,
        display: indicatorStyle.display,
      }}
    >
      <DropIndicator show={true} />
    </div>
  );
}

export function Canvas() {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Zustand state
  const viewport = useBuilderStore((s) => s.viewport);
  const blocks = useBuilderStore((s) => s.history.present.blocks);
  const selectedId = useBuilderStore((s) => s.selectedId);
  const select = useBuilderStore((s) => s.select);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const deleteBlock = useBuilderStore((s) => s.deleteBlock);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const addBlock = useBuilderStore((s) => s.addBlock);

  // CSS classes
  const widthClass = viewport === "mobile" ? "w-[320px]" : "w-[600px]";

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((b) => (b as Block).id === active.id);
    const to = blocks.findIndex((b) => (b as Block).id === over.id);
    if (from >= 0 && to >= 0) moveBlock(from, to);
  }

  const activeBlock = activeId
    ? blocks.find((b) => (b as Block).id === activeId)
    : null;

  return (
    <div className="flex w-full justify-center">
      <div
        className={`mx-auto ${widthClass} max-w-full rounded-lg border border-dashed border-zinc-300 bg-white p-6 shadow-sm transition-all`}
        onDragOver={(e) => {
          // Only handle drag over when container is empty
          if (
            blocks.length === 0 &&
            e.dataTransfer.types.includes("application/x-mailcraft-block")
          ) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }
        }}
        onDrop={(e) => {
          // Only handle drop when container is empty (SingleDropZoneContainer handles when blocks exist)
          if (blocks.length === 0) {
            const key = e.dataTransfer.getData("application/x-mailcraft-block");
            if (key) {
              e.preventDefault();
              e.stopPropagation();
              addBlock(key);
            }
          }
        }}
      >
        {blocks.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-zinc-500">
            <div>
              <p className="mb-2 font-medium">Start building your email</p>
              <p className="text-xs text-zinc-400">
                Drag components from the left panel or click to add them
              </p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => (b as Block).id)}
              strategy={verticalListSortingStrategy}
            >
              <SingleDropZoneContainer
                blocks={blocks.map((b) => b as Block)}
                onDrop={(key, index) => addBlock(key, index)}
              >
                <div className="flex flex-col gap-3">
                  {blocks.map((b, idx) => (
                    <div key={(b as Block).id} data-block-index={idx}>
                      <SortableBlockShell
                        block={b as Block}
                        selected={selectedId === (b as Block).id}
                        onSelect={() => select((b as Block).id)}
                        onDelete={() => deleteBlock((b as Block).id)}
                        onDuplicate={() => duplicateBlock((b as Block).id)}
                      />
                    </div>
                  ))}
                </div>
              </SingleDropZoneContainer>
            </SortableContext>
            <DragOverlay>
              {activeBlock ? (
                <div className="opacity-50">
                  <BlockPreview block={activeBlock as Block} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}
