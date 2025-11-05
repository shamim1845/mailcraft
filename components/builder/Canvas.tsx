"use client";

import { useBuilderStore } from "../../lib/state/store";
import {
  Block,
  ColumnsBlock,
  HeaderBlock,
  FooterBlock,
  IconBlock,
} from "../../lib/schema/block";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded border ${
        selected ? "border-zinc-900" : "border-zinc-200"
      } hover:border-zinc-400`}
      onClick={onSelect}
      {...attributes}
      {...listeners}
    >
      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <button
          className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          Edit
        </button>
        <button
          className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          Duplicate
        </button>
        <button
          className="rounded border border-red-200 bg-white px-2 py-0.5 text-xs text-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
      <div className="p-3">
        <BlockPreview block={block} />
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <div dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "image":
      return (
        <img
          src={block.url}
          alt={block.alt}
          style={{
            width: block.width,
            height: block.height === "auto" ? "auto" : block.height,
          }}
        />
      );
    case "button":
      return (
        <a
          href={block.url}
          className="inline-block"
          style={{
            background: block.bg,
            color: block.color,
            borderRadius: block.radius,
            padding: `${block.paddingV}px ${block.paddingH}px`,
            fontSize: block.fontSize,
          }}
        >
          {block.text}
        </a>
      );
    case "divider":
      return (
        <hr
          style={{
            borderTopWidth: block.thickness,
            borderTopColor: block.color,
            borderTopStyle: block.style,
          }}
        />
      );
    case "spacer":
      return <div style={{ height: block.height }} />;
    case "social":
      return (
        <div
          className="flex items-center justify-center"
          style={{ gap: block.gap }}
        >
          {block.platforms.map((p) => (
            <a
              key={p.key}
              href={p.url}
              className="inline-block"
              style={{ width: block.size, height: block.size }}
            >
              <div
                className="rounded-full bg-zinc-200"
                style={{ width: block.size, height: block.size }}
              />
            </a>
          ))}
        </div>
      );
    case "columns":
      return <ColumnsPreview block={block as ColumnsBlock} />;
    case "icon":
      return (
        <a href={(block as IconBlock).url ?? "#"} className="inline-block">
          <div
            className="rounded"
            style={{
              width: (block as IconBlock).size,
              height: (block as IconBlock).size,
              background: (block as IconBlock).color,
            }}
          />
        </a>
      );
    case "header":
      return (
        <div
          className="flex items-center justify-between"
          style={{
            background: (block as HeaderBlock).bg ?? "transparent",
            color: (block as HeaderBlock).color ?? "inherit",
            padding: `${(block as HeaderBlock).padding.top}px ${
              (block as HeaderBlock).padding.right
            }px ${(block as HeaderBlock).padding.bottom}px ${
              (block as HeaderBlock).padding.left
            }px`,
          }}
        >
          {(block as HeaderBlock).logoUrl ? (
            <img
              src={(block as HeaderBlock).logoUrl as string}
              alt="logo"
              className="h-8 w-auto"
            />
          ) : (
            <div className="text-sm">Logo</div>
          )}
          <div className="flex items-center gap-3 text-sm">
            {(block as HeaderBlock).menu.map((m) => (
              <a key={m.id} href={m.url} className="hover:underline">
                {m.text}
              </a>
            ))}
          </div>
        </div>
      );
    case "footer":
      return (
        <div
          className="text-center text-xs"
          style={{
            background: (block as FooterBlock).bg ?? "transparent",
            color: (block as FooterBlock).color ?? "inherit",
          }}
        >
          <div className="font-medium">{(block as FooterBlock).company}</div>
          {(block as FooterBlock).address && (
            <div className="opacity-70">{(block as FooterBlock).address}</div>
          )}
          <div className="mt-2 flex justify-center gap-3">
            {(block as FooterBlock).socials.map((s, i: number) => (
              <a key={i} href={s.url} className="text-blue-600 hover:underline">
                {s.key}
              </a>
            ))}
          </div>
          {(block as FooterBlock).unsubscribeText && (
            <div className="mt-2 opacity-70">
              {(block as FooterBlock).unsubscribeText}
            </div>
          )}
          {(block as FooterBlock).copyright && (
            <div className="mt-2 opacity-70">
              {(block as FooterBlock).copyright}
            </div>
          )}
        </div>
      );
    default:
      return <div className="text-xs text-zinc-500">Unsupported block</div>;
  }
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
    >
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex" style={{ gap: block.gap }}>
          {block.columns.map(
            (col: { id: string; children: Block[] }, idx: number) => (
              <div
                key={col.id}
                style={{ flex: `${block.widths[idx] ?? 1}` }}
                onDragOver={(e) => {
                  if (
                    e.dataTransfer.types.includes(
                      "application/x-mailcraft-block"
                    )
                  ) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "copy";
                  }
                }}
                onDrop={(e) => {
                  const key = e.dataTransfer.getData(
                    "application/x-mailcraft-block"
                  );
                  if (key) {
                    e.preventDefault();
                    addIn(block.id, idx, key);
                  }
                }}
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
                      <div
                        key={child.id}
                        onDragOver={(e) => {
                          if (
                            e.dataTransfer.types.includes(
                              "application/x-mailcraft-block"
                            )
                          ) {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "copy";
                          }
                        }}
                        onDrop={(e) => {
                          const key = e.dataTransfer.getData(
                            "application/x-mailcraft-block"
                          );
                          if (key) {
                            e.preventDefault();
                            addIn(block.id, idx, key, i);
                          }
                        }}
                      >
                        <SortableItem
                          id={child.id}
                          container={`col:${idx}`}
                          index={i}
                        >
                          <div
                            className={`group relative rounded border ${
                              selectedId === child.id
                                ? "border-zinc-900"
                                : "border-zinc-200"
                            } hover:border-zinc-400`}
                            onClick={() => select(child.id)}
                          >
                            <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
                              <button
                                className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  select(child.id);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateIn(block.id, idx, child.id);
                                }}
                              >
                                Duplicate
                              </button>
                              <button
                                className="rounded border border-red-200 bg-white px-2 py-0.5 text-xs text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteIn(block.id, idx, child.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                            <div className="p-3">
                              <BlockPreview block={child} />
                            </div>
                          </div>
                        </SortableItem>
                      </div>
                    ))}
                  </div>
                </SortableContext>
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
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { container, index } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function Canvas() {
  const viewport = useBuilderStore((s) => s.viewport);
  const blocks = useBuilderStore((s) => s.history.present.blocks);
  const selectedId = useBuilderStore((s) => s.selectedId);
  const select = useBuilderStore((s) => s.select);
  const duplicateBlock = useBuilderStore((s) => s.duplicateBlock);
  const deleteBlock = useBuilderStore((s) => s.deleteBlock);
  const moveBlock = useBuilderStore((s) => s.moveBlock);
  const addBlock = useBuilderStore((s) => s.addBlock);

  const widthClass = viewport === "mobile" ? "w-[320px]" : "w-[600px]";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((b) => (b as Block).id === active.id);
    const to = blocks.findIndex((b) => (b as Block).id === over.id);
    if (from >= 0 && to >= 0) moveBlock(from, to);
  }

  return (
    <div className="flex w-full justify-center">
      <div
        className={`mx-auto ${widthClass} max-w-full rounded border border-dashed border-zinc-300 bg-white p-6 shadow-sm`}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("application/x-mailcraft-block")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }
        }}
        onDrop={(e) => {
          const key = e.dataTransfer.getData("application/x-mailcraft-block");
          if (key) {
            e.preventDefault();
            addBlock(key);
          }
        }}
      >
        {blocks.length === 0 ? (
          <div className="text-center text-sm text-zinc-500">
            Drag components from the left to start building
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext
              items={blocks.map((b) => (b as Block).id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {blocks.map((b, idx) => (
                  <div
                    key={(b as Block).id}
                    onDragOver={(e) => {
                      if (
                        e.dataTransfer.types.includes(
                          "application/x-mailcraft-block"
                        )
                      ) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "copy";
                      }
                    }}
                    onDrop={(e) => {
                      const key = e.dataTransfer.getData(
                        "application/x-mailcraft-block"
                      );
                      if (key) {
                        e.preventDefault();
                        addBlock(key, idx);
                      }
                    }}
                  >
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
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
