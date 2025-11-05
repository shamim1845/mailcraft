"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import DOMPurify from "dompurify";
import { useEffect } from "react";

export function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc max-w-none min-h-[120px] rounded border border-zinc-200 p-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(DOMPurify.sanitize(html));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-xs"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-xs"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-xs"
          onClick={() => editor?.chain().focus().toggleUnderline?.().run?.()}
        >
          U
        </button>
        <button
          className="rounded border border-zinc-200 px-2 py-1 text-xs"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
