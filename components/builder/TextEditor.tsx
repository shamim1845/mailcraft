"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import DOMPurify from "dompurify";

export function TextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Link, Underline],
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

  // Update editor content when value changes
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) editor.commands.setContent(value);
  }, [value, editor]);

  // Get the active formatting states
  const isBold = editor?.isActive("bold");
  const isItalic = editor?.isActive("italic");
  const isUnderline = editor?.isActive("underline");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          className={`rounded border border-zinc-200 px-2 py-1 text-xs transition-colors ${
            isBold ? "bg-zinc-900 text-white" : "hover:bg-zinc-50"
          }`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          className={`rounded border border-zinc-200 px-2 py-1 text-xs transition-colors ${
            isItalic ? "bg-zinc-900 text-white" : "hover:bg-zinc-50"
          }`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          className={`rounded border border-zinc-200 px-2 py-1 text-xs transition-colors ${
            isUnderline ? "bg-zinc-900 text-white" : "hover:bg-zinc-50"
          }`}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          className={`rounded border border-zinc-200 px-2 py-1 text-xs transition-colors hover:bg-zinc-50 ${
            editor?.isActive("bulletList") ? "bg-zinc-900 text-white" : ""
          }`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          • List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
