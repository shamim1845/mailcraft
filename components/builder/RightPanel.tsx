"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useBuilderStore } from "../../lib/state/store";
import { Block } from "../../lib/schema/block";
import { TextEditor } from "./TextEditor";
import { useToast } from "../ui/ToastProvider";

export function RightPanel() {
  const selectedId = useBuilderStore((s) => s.selectedId);
  const blocks = useBuilderStore((s) => s.history.present.blocks);
  const updateBlock = useBuilderStore((s) => s.updateBlock);
  const { notify } = useToast();

  const block = blocks.find((b) => (b as Block).id === selectedId) as
    | Block
    | undefined;

  if (!block) {
    return (
      <div className="flex h-full flex-col gap-3">
        <div className="text-sm text-zinc-600">Select a component to edit</div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500">
          Properties will appear here based on the selected component.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="text-sm font-medium">
        {block.type.toUpperCase()} properties
      </div>
      {block.type === "text" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Content</label>
          <TextEditor
            value={block.html}
            onChange={(html) =>
              updateBlock(block.id, (b: any) => ({ ...b, html }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Font size</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.fontSize}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    fontSize: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Color</label>
              <input
                type="color"
                className="h-8 w-full rounded border border-zinc-200"
                value={block.color}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    color: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Font family</label>
              <select
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.fontFamily}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    fontFamily: e.target.value,
                  }))
                }
              >
                <option>Arial</option>
                <option>Georgia</option>
                <option>Times New Roman</option>
                <option>Verdana</option>
                <option>Courier</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-600">Alignment</label>
              <select
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.align}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    align: e.target.value,
                  }))
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <div key={side}>
                <label className="text-xs text-zinc-600">Padding {side}</label>
                <input
                  type="number"
                  className="w-full rounded border border-zinc-200 p-1 text-sm"
                  value={block.padding[side]}
                  onChange={(e) =>
                    updateBlock(block.id, (b: any) => ({
                      ...b,
                      padding: { ...b.padding, [side]: Number(e.target.value) },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {block.type === "image" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Image URL</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.url}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({ ...b, url: e.target.value }))
            }
          />
          <label className="text-xs text-zinc-600">Alt text</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.alt}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({ ...b, alt: e.target.value }))
            }
          />
          <label className="text-xs text-zinc-600">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const url = URL.createObjectURL(f);
              updateBlock(block.id, (b: any) => ({ ...b, url }));
              notify("Image loaded locally");
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Width</label>
              <input
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.width}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    width: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Height</label>
              <input
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.height}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    height: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Alignment</label>
              <select
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.align}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    align: e.target.value,
                  }))
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <label className="text-xs text-zinc-600">Link URL</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.link ?? ""}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                link: e.target.value,
              }))
            }
          />

          <div>
            <label className="text-xs text-zinc-600">Padding</label>
            <div className="grid grid-cols-4 gap-2">
              {(["top", "right", "bottom", "left"] as const).map((side) => (
                <div key={side}>
                  <label className="text-xs text-zinc-600">
                    {side.charAt(0).toUpperCase() + side.slice(1)}
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-zinc-200 p-1 text-sm"
                    value={block.padding[side]}
                    onChange={(e) =>
                      updateBlock(block.id, (b: any) => ({
                        ...b,
                        padding: {
                          ...b.padding,
                          [side]: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {block.type === "button" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Text</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.text}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                text: e.target.value,
              }))
            }
          />
          <label className="text-xs text-zinc-600">Link URL</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.url}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({ ...b, url: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Background</label>
              <input
                type="color"
                className="h-8 w-full rounded border border-zinc-200"
                value={block.bg}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    bg: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Text color</label>
              <input
                type="color"
                className="h-8 w-full rounded border border-zinc-200"
                value={block.color}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    color: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Radius</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.radius}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    radius: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Font size</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.fontSize}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    fontSize: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Align</label>
              <select
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.align}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    align: e.target.value,
                  }))
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding V</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.paddingV}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    paddingV: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding H</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.paddingH}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    paddingH: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
      {block.type === "divider" && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Thickness</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.thickness}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    thickness: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Color</label>
              <input
                type="color"
                className="h-8 w-full rounded border border-zinc-200"
                value={block.color}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    color: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <label className="text-xs text-zinc-600">Style</label>
          <select
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.style}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                style: e.target.value,
              }))
            }
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Padding top</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.top}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, top: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding bottom</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.bottom}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, bottom: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
      {block.type === "spacer" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Height</label>
          <input
            type="number"
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.height}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                height: Number(e.target.value),
              }))
            }
          />
        </div>
      )}
      {block.type === "social" && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="text-xs text-zinc-600">Platforms</div>
            <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
              {(["facebook", "twitter", "instagram", "linkedin"] as const).map(
                (key) => {
                  const enabled = block.platforms.some((p) => p.key === key);
                  return (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) =>
                          updateBlock(block.id, (b: any) => {
                            const exists = b.platforms.some(
                              (p: any) => p.key === key
                            );
                            let platforms = [...b.platforms];
                            if (e.target.checked && !exists) {
                              platforms.push({ key, url: "#" });
                            } else if (!e.target.checked && exists) {
                              platforms = platforms.filter(
                                (p: any) => p.key !== key
                              );
                            }
                            return { ...b, platforms };
                          })
                        }
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  );
                }
              )}
            </div>
          </div>
          <label className="text-xs text-zinc-600">Alignment</label>
          <select
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.align}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                align: e.target.value,
              }))
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Icon size</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.size}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    size: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Spacing</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.gap}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    gap: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {block.platforms.map((p, i) => (
              <div key={i} className="grid grid-cols-3 items-center gap-2">
                <div className="text-xs capitalize text-zinc-600">{p.key}</div>
                <input
                  className="col-span-2 w-full rounded border border-zinc-200 p-1 text-sm"
                  value={p.url}
                  onChange={(e) =>
                    updateBlock(block.id, (b: any) => {
                      const platforms = [...b.platforms];
                      platforms[i] = { ...platforms[i], url: e.target.value };
                      return { ...b, platforms };
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {block.type === "icon" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Icon</label>
          <select
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={(block as any).icon}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                icon: e.target.value,
              }))
            }
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="star">Star</option>
          </select>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Size</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={(block as any).size}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    size: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Color</label>
              <input
                type="color"
                className="h-8 w-full rounded border border-zinc-200"
                value={(block as any).color}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    color: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Link URL</label>
              <input
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={(block as any).url ?? ""}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    url: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
      {block.type === "columns" && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Columns</label>
              <select
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.numColumns}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => {
                    const n = Number(e.target.value) as 2 | 3;
                    const widths = n === 2 ? [0.5, 0.5] : [1 / 3, 1 / 3, 1 / 3];
                    let columns = [...b.columns];
                    if (n === 2) {
                      columns = columns.slice(0, 2);
                      if (columns.length < 2)
                        columns.push({ id: crypto.randomUUID(), children: [] });
                    } else {
                      if (columns.length < 3)
                        columns = [
                          ...columns,
                          { id: crypto.randomUUID(), children: [] },
                        ].slice(0, 3);
                      columns = columns.slice(0, 3);
                    }
                    return { ...b, numColumns: n, widths, columns };
                  })
                }
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div className="col-span-2 flex items-end">
              <button
                className="w-full rounded border border-zinc-200 px-2 py-1 text-sm"
                onClick={() =>
                  updateBlock(block.id, (b: any) => {
                    const n = b.numColumns as 2 | 3;
                    const widths = Array(n).fill(1 / n);
                    return { ...b, widths };
                  })
                }
              >
                Equal widths
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {block.widths.map((w, i) => (
              <div key={i}>
                <label className="text-xs text-zinc-600">Col {i + 1} %</label>
                <input
                  type="number"
                  className="w-full rounded border border-zinc-200 p-1 text-sm"
                  value={Math.round(w * 100)}
                  onChange={(e) =>
                    updateBlock(block.id, (b: any) => {
                      const next = [...b.widths];
                      next[i] = Math.max(0, Number(e.target.value)) / 100;
                      const sum =
                        next.reduce((a: number, x: number) => a + x, 0) || 1;
                      const normalized = next.map((x) => x / sum);
                      return { ...b, widths: normalized };
                    })
                  }
                />
              </div>
            ))}
          </div>
          <label className="text-xs text-zinc-600">Background</label>
          <input
            type="color"
            className="h-8 w-full rounded border border-zinc-200"
            value={block.background ?? "#ffffff"}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                background: e.target.value,
              }))
            }
          />
          <label className="text-xs text-zinc-600">Gap</label>
          <input
            type="number"
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.gap}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                gap: Number(e.target.value),
              }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-600">Padding top</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.top}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, top: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding right</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.right}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, right: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding bottom</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.bottom}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, bottom: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div>
              <label className="text-xs text-zinc-600">Padding left</label>
              <input
                type="number"
                className="w-full rounded border border-zinc-200 p-1 text-sm"
                value={block.padding.left}
                onChange={(e) =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    padding: { ...b.padding, left: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
      {block.type === "header" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Logo URL</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.logoUrl ?? ""}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                logoUrl: e.target.value,
              }))
            }
          />
          <div className="mt-1">
            <div className="mb-1 text-xs text-zinc-600">Menu</div>
            <div className="flex flex-col gap-2">
              {block.menu.map((m, idx) => (
                <div key={m.id} className="grid grid-cols-5 items-center gap-2">
                  <input
                    className="col-span-2 rounded border border-zinc-200 p-1 text-sm"
                    value={m.text}
                    onChange={(e) =>
                      updateBlock(block.id, (b: any) => {
                        const menu = [...b.menu];
                        menu[idx] = { ...menu[idx], text: e.target.value };
                        return { ...b, menu };
                      })
                    }
                  />
                  <input
                    className="col-span-2 rounded border border-zinc-200 p-1 text-sm"
                    value={m.url}
                    onChange={(e) =>
                      updateBlock(block.id, (b: any) => {
                        const menu = [...b.menu];
                        menu[idx] = { ...menu[idx], url: e.target.value };
                        return { ...b, menu };
                      })
                    }
                  />
                  <button
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                    onClick={() =>
                      updateBlock(block.id, (b: any) => ({
                        ...b,
                        menu: b.menu.filter((_: any, i: number) => i !== idx),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="rounded border border-zinc-200 px-2 py-1 text-sm"
                onClick={() =>
                  updateBlock(block.id, (b: any) => ({
                    ...b,
                    menu: [
                      ...b.menu,
                      { id: crypto.randomUUID(), text: "Item", url: "#" },
                    ],
                  }))
                }
              >
                Add item
              </button>
            </div>
          </div>
          <label className="text-xs text-zinc-600">Background</label>
          <input
            type="color"
            className="h-8 w-full rounded border border-zinc-200"
            value={block.bg ?? "#ffffff"}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({ ...b, bg: e.target.value }))
            }
          />
          <label className="text-xs text-zinc-600">Text color</label>
          <input
            type="color"
            className="h-8 w-full rounded border border-zinc-200"
            value={block.color ?? "#111111"}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                color: e.target.value,
              }))
            }
          />
        </div>
      )}
      {block.type === "footer" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-zinc-600">Company</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.company}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                company: e.target.value,
              }))
            }
          />
          <label className="text-xs text-zinc-600">Address</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.address ?? ""}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                address: e.target.value,
              }))
            }
          />
          <div className="mt-1">
            <div className="mb-1 text-xs text-zinc-600">Social links</div>
            <div className="flex flex-col gap-2">
              {(["facebook", "twitter", "instagram", "linkedin"] as const).map(
                (key) => {
                  const idx = block.socials.findIndex((s) => s.key === key);
                  const present = idx >= 0;
                  return (
                    <div
                      key={key}
                      className="grid grid-cols-5 items-center gap-2"
                    >
                      <div className="text-xs capitalize text-zinc-600">
                        {key}
                      </div>
                      <input
                        className="col-span-3 rounded border border-zinc-200 p-1 text-sm"
                        value={present ? block.socials[idx].url : ""}
                        placeholder="#"
                        onChange={(e) =>
                          updateBlock(block.id, (b: any) => {
                            const socialsNext = [...b.socials];
                            const i = socialsNext.findIndex(
                              (s: any) => s.key === key
                            );
                            if (i >= 0)
                              socialsNext[i] = {
                                ...socialsNext[i],
                                url: e.target.value,
                              };
                            else socialsNext.push({ key, url: e.target.value });
                            return { ...b, socials: socialsNext };
                          })
                        }
                      />
                      <label className="flex items-center justify-end gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={present}
                          onChange={(e) =>
                            updateBlock(block.id, (b: any) => {
                              const socialsNext = [...b.socials];
                              const i = socialsNext.findIndex(
                                (s: any) => s.key === key
                              );
                              if (e.target.checked && i < 0)
                                socialsNext.push({ key, url: "#" });
                              if (!e.target.checked && i >= 0)
                                socialsNext.splice(i, 1);
                              return { ...b, socials: socialsNext };
                            })
                          }
                        />
                        Show
                      </label>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <label className="text-xs text-zinc-600">Unsubscribe text</label>
          <input
            className="w-full rounded border border-zinc-200 p-1 text-sm"
            value={block.unsubscribeText ?? ""}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                unsubscribeText: e.target.value,
              }))
            }
          />
          <label className="text-xs text-zinc-600">Background</label>
          <input
            type="color"
            className="h-8 w-full rounded border border-zinc-200"
            value={block.bg ?? "#f4f4f5"}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({ ...b, bg: e.target.value }))
            }
          />
          <label className="text-xs text-zinc-600">Text color</label>
          <input
            type="color"
            className="h-8 w-full rounded border border-zinc-200"
            value={block.color ?? "#111111"}
            onChange={(e) =>
              updateBlock(block.id, (b: any) => ({
                ...b,
                color: e.target.value,
              }))
            }
          />
        </div>
      )}
    </div>
  );
}
