"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Block, Template } from "../schema/block";
import { nanoid } from "nanoid";
import { createDefaultBlock } from "../utils/defaults";

type ViewportMode = "desktop" | "mobile";

type HistoryState = {
    past: Template[];
    present: Template;
    future: Template[];
};

type BuilderState = {
    viewport: ViewportMode;
    selectedId?: string;
    history: HistoryState;
    setViewport: (m: ViewportMode) => void;
    select: (id?: string) => void;
    commit: (next: Template) => void;
    undo: () => void;
    redo: () => void;
    load: (t: Template) => void;
    updateName: (name: string) => void;
    saveLocal: () => void;
    loadLocal: () => void;
    addBlock: (key: string, atIndex?: number) => void;
    deleteBlock: (id: string) => void;
    duplicateBlock: (id: string) => void;
    moveBlock: (from: number, to: number) => void;
    updateBlock: (id: string, updater: (b: any) => any) => void;
    addBlockToColumn: (columnsId: string, colIdx: number, key: string, atIndex?: number) => void;
    deleteBlockInColumn: (columnsId: string, colIdx: number, id: string) => void;
    duplicateBlockInColumn: (columnsId: string, colIdx: number, id: string) => void;
    moveBlockInColumns: (columnsId: string, fromCol: number, fromIdx: number, toCol: number, toIdx: number) => void;
};

const emptyTemplate: Template = {
    id: "template-1",
    name: "Untitled Template",
    blocks: [],
};

export const useBuilderStore = create<BuilderState>()(
    immer((set, get) => ({
        viewport: "desktop",
        selectedId: undefined,
        history: { past: [], present: emptyTemplate, future: [] },
        setViewport: (m) => set((s) => void (s.viewport = m)),
        select: (id) => set((s) => void (s.selectedId = id)),
        commit: (next) =>
            set((s) => {
                s.history.past.push(s.history.present);
                s.history.present = next;
                s.history.future = [];
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        undo: () =>
            set((s) => {
                const prev = s.history.past.pop();
                if (!prev) return;
                s.history.future.unshift(s.history.present);
                s.history.present = prev;
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        redo: () =>
            set((s) => {
                const next = s.history.future.shift();
                if (!next) return;
                s.history.past.push(s.history.present);
                s.history.present = next;
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        load: (t) =>
            set((s) => {
                s.history = { past: [], present: t, future: [] };
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        updateName: (name) =>
            set((s) => {
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, name };
                s.history.future = [];
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        saveLocal: () => {
            try {
                const t = get().history.present;
                localStorage.setItem("mailcraft:auto", JSON.stringify(t));
            } catch { }
        },
        loadLocal: () => {
            try {
                const raw = localStorage.getItem("mailcraft:auto");
                if (!raw) return;
                const t = JSON.parse(raw) as Template;
                set((s) => {
                    s.history = { past: [], present: t, future: [] };
                });
            } catch { }
        },
        addBlock: (key, atIndex) =>
            set((s) => {
                const next: Template = {
                    ...s.history.present,
                    blocks: [...s.history.present.blocks],
                };
                const b: Block = createDefaultBlock(key);
                if (atIndex !== undefined && atIndex >= 0 && atIndex <= next.blocks.length) {
                    next.blocks.splice(atIndex, 0, b);
                } else {
                    next.blocks.push(b);
                }
                s.history.past.push(s.history.present);
                s.history.present = next;
                s.history.future = [];
                s.selectedId = b.id;
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        deleteBlock: (id) =>
            set((s) => {
                const next: Template = {
                    ...s.history.present,
                    blocks: s.history.present.blocks.filter((b) => (b as Block).id !== id),
                };
                s.history.past.push(s.history.present);
                s.history.present = next;
                s.history.future = [];
                if (s.selectedId === id) s.selectedId = undefined;
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        duplicateBlock: (id) =>
            set((s) => {
                const idx = s.history.present.blocks.findIndex((b) => (b as Block).id === id);
                if (idx < 0) return;
                const orig = s.history.present.blocks[idx] as Block;
                const copy: Block = { ...orig, id: nanoid() } as Block;
                const next: Template = {
                    ...s.history.present,
                    blocks: [
                        ...s.history.present.blocks.slice(0, idx + 1),
                        copy,
                        ...s.history.present.blocks.slice(idx + 1),
                    ],
                };
                s.history.past.push(s.history.present);
                s.history.present = next;
                s.history.future = [];
                s.selectedId = copy.id;
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        moveBlock: (from, to) =>
            set((s) => {
                const len = s.history.present.blocks.length;
                if (from < 0 || from >= len || to < 0 || to >= len) return;
                const arr = [...s.history.present.blocks];
                const [item] = arr.splice(from, 1);
                arr.splice(to, 0, item);
                const next: Template = { ...s.history.present, blocks: arr };
                s.history.past.push(s.history.present);
                s.history.present = next;
                s.history.future = [];
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        updateBlock: (id, updater) =>
            set((s) => {
                function updateInArray(arr: any[]): any[] {
                    return arr.map((item) => {
                        const block = item as Block;
                        if (block.id === id) {
                            return updater(block);
                        }
                        if (block.type === "columns") {
                            const updatedColumns = block.columns.map((col) => ({
                                ...col,
                                children: updateInArray(col.children as any[]),
                            }));
                            return { ...block, columns: updatedColumns } as any;
                        }
                        return block;
                    });
                }
                const nextBlocks = updateInArray(s.history.present.blocks as any[]);
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, blocks: nextBlocks as any };
                s.history.future = [];
                try {
                    localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present));
                } catch { }
            }),
        addBlockToColumn: (columnsId, colIdx, key, atIndex) =>
            set((s) => {
                const b = createDefaultBlock(key);
                const nextBlocks = (s.history.present.blocks as any[]).map((it: any) => {
                    if ((it as Block).id !== columnsId || it.type !== "columns") return it;
                    const cols = it.columns.map((col: any, i: number) => {
                        if (i !== colIdx) return col;
                        const children = [...col.children];
                        if (atIndex !== undefined && atIndex >= 0 && atIndex <= children.length) {
                            children.splice(atIndex, 0, b);
                        } else {
                            children.push(b);
                        }
                        return { ...col, children };
                    });
                    return { ...it, columns: cols };
                });
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, blocks: nextBlocks as any };
                s.history.future = [];
                s.selectedId = b.id;
                try { localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present)); } catch { }
            }),
        deleteBlockInColumn: (columnsId, colIdx, id) =>
            set((s) => {
                const nextBlocks = (s.history.present.blocks as any[]).map((it: any) => {
                    if ((it as Block).id !== columnsId || it.type !== "columns") return it;
                    const cols = it.columns.map((col: any, i: number) => {
                        if (i !== colIdx) return col;
                        return { ...col, children: col.children.filter((c: any) => c.id !== id) };
                    });
                    return { ...it, columns: cols };
                });
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, blocks: nextBlocks as any };
                s.history.future = [];
                if (s.selectedId === id) s.selectedId = undefined;
                try { localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present)); } catch { }
            }),
        duplicateBlockInColumn: (columnsId, colIdx, id) =>
            set((s) => {
                let copy: any | undefined;
                const nextBlocks = (s.history.present.blocks as any[]).map((it: any) => {
                    if ((it as Block).id !== columnsId || it.type !== "columns") return it;
                    const cols = it.columns.map((col: any, i: number) => {
                        if (i !== colIdx) return col;
                        const idx = col.children.findIndex((c: any) => c.id === id);
                        if (idx < 0) return col;
                        copy = { ...col.children[idx], id: nanoid() };
                        const children = [
                            ...col.children.slice(0, idx + 1),
                            copy,
                            ...col.children.slice(idx + 1),
                        ];
                        return { ...col, children };
                    });
                    return { ...it, columns: cols };
                });
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, blocks: nextBlocks as any };
                s.history.future = [];
                if (copy) s.selectedId = copy.id;
                try { localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present)); } catch { }
            }),
        moveBlockInColumns: (columnsId, fromCol, fromIdx, toCol, toIdx) =>
            set((s) => {
                const nextBlocks = (s.history.present.blocks as any[]).map((it: any) => {
                    if ((it as Block).id !== columnsId || it.type !== "columns") return it;
                    const cols = it.columns.map((col: any) => ({ ...col, children: [...col.children] }));
                    const [item] = cols[fromCol].children.splice(fromIdx, 1);
                    cols[toCol].children.splice(toIdx, 0, item);
                    return { ...it, columns: cols };
                });
                s.history.past.push(s.history.present);
                s.history.present = { ...s.history.present, blocks: nextBlocks as any };
                s.history.future = [];
                try { localStorage.setItem("mailcraft:auto", JSON.stringify(s.history.present)); } catch { }
            }),
    }))
);


