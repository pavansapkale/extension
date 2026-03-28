import type { Metadata } from 'next'
import Editor from '@/components/Editor'

export const metadata: Metadata = {
  title: 'Tiptap Columns Editor - Confluence Style',
  description: 'A rich text editor with multi-column support built with Tiptap and Next.js',
}

export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#1a1a1a'
        }}>
          Multi-Column Editor
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#666', 
          marginBottom: '32px'
        }}>
          Create Confluence-style layouts with multiple columns. Add, remove, and resize columns with ease.
        </p>
        
        <Editor content={`
          <h2>Welcome to the Multi-Column Editor!</h2>
          <p>This editor supports <strong>multiple columns</strong> just like Confluence. Try it out:</p>
          <ul>
            <li>Click "2 Columns" or "3 Columns" in the toolbar to add column layouts</li>
            <li>Hover between columns to see resize handles</li>
            <li>Drag the handles to resize columns</li>
            <li>Use keyboard shortcuts: <code>Mod+Alt+C</code> for 2 columns, <code>Mod+Alt+Shift+C</code> for 3 columns</li>
          </ul>
          <p>Start creating beautiful layouts today!</p>
        `} />
        
        <div style={{ 
          marginTop: '40px', 
          padding: '24px', 
          backgroundColor: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#1a1a1a' }}>
            Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>📐 Multiple Columns</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Add 2, 3, or more columns to your content layout</p>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>↔️ Resize Columns</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Drag resize handles to adjust column widths interactively</p>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>⌨️ Keyboard Shortcuts</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Quick commands for adding columns without using the toolbar</p>
            </div>
            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>🎨 Confluence-Style</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>Familiar editing experience similar to Atlassian Confluence</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
