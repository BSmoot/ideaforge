import { useEditor as useTipTapEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';

interface IUseEditorOptions {
  content?: string;
  placeholder?: string;
  onUpdate?: (markdown: string) => void;
}

export function useMarkdownEditor(
  options: IUseEditorOptions = {}
): Editor | null {
  const editor = useTipTapEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: options.placeholder ?? 'Start writing your idea...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent-text underline hover:text-accent',
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: options.content ?? '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-foreground',
      },
    },
    onUpdate: ({ editor: e }) => {
      if (options.onUpdate) {
        const md = e.storage.markdown.getMarkdown() as string;
        options.onUpdate(md);
      }
    },
  });

  return editor;
}
