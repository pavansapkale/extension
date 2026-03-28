'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Columns } from '@/extensions/columns'
import '@/extensions/columns/styles.css'

interface EditorProps {
  content?: string
  onSave?: (content: string) => void
}

export const Editor = ({ content = '<p>Start editing...</p>', onSave }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Columns.configure({
        handleWidth: 2,
        columnMinWidth: 50,
        enableKeymap: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onSave) {
        onSave(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-full',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 px-4 py-2 flex gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().insertColumns(2).run()}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          title="Insert 2 columns"
        >
          2 Columns
        </button>
        <button
          onClick={() => editor.chain().focus().insertColumns(3).run()}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          title="Insert 3 columns"
        >
          3 Columns
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-sm border rounded transition-colors ${
            editor.isActive('bold') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-100'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-sm border rounded transition-colors ${
            editor.isActive('italic') 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 hover:bg-gray-100'
          }`}
          title="Italic"
        >
          I
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          ↶ Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Info footer */}
      <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500">
        <span>💡 Tip: Hover between columns to see resize handles. Click the + button to add columns.</span>
      </div>
    </div>
  )
}

export default Editor
