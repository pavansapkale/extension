# Multi-Column Extension Implementation Plan for Tiptap (Next.js + TypeScript)

## Overview
This document outlines the plan to implement a Confluence-style multi-column layout feature for your Tiptap editor in Next.js, based on the prosemirror-columns reference implementation.

## Feature Requirements

### Core Features
1. **Add Columns**: Create column containers with multiple columns
2. **Remove Columns**: Delete individual columns or entire column containers
3. **Resize Columns**: Drag to resize column widths with visual handles
4. **Content Editing**: Full editing capabilities within each column
5. **Keyboard Navigation**: Proper Enter/Exit behavior and selection handling

### UI/UX Goals (Confluence-style)
- Clean, professional column layouts
- Visual resize handles between columns
- Add column button (plus icon) on hover
- Cursor changes when hovering over resize handles
- Minimum column width enforcement
- Smooth drag resizing experience

## Architecture

### File Structure
```
src/extensions/columns/
├── index.ts              # Main export file
├── ColumnExtension.ts    # Column node extension
├── ColumnContainerExtension.ts  # Column container node extension
├── ColumnsExtension.ts   # Main extension that combines everything
├── plugins/
│   ├── resizePlugin.ts   # Resize handle plugin
│   └── keymapPlugin.ts   # Keyboard shortcuts plugin
├── utils/
│   ├── domHelpers.ts     # DOM manipulation utilities
│   └── columnHelpers.ts  # Column-specific utilities
├── types.ts              # TypeScript type definitions
└── styles.css            # Column styling
```

### Node Schema

#### Column Container Node
- **Name**: `column_container`
- **Group**: block
- **Content**: `column+` (one or more columns)
- **Attributes**: None initially
- **DOM**: `<div class="prosemirror-column-container">`

#### Column Node
- **Name**: `column`
- **Group**: block
- **Content**: `block+` (one or more block nodes)
- **Attributes**: 
  - `colWidth`: number (default: 200px)
- **DOM**: `<div class="prosemirror-column" style="width: {colWidth}px;">`

## Implementation Components

### 1. Column Node Extension
```typescript
- Define node spec with colWidth attribute
- Parse HTML from existing content
- Render to DOM with inline styles
- Handle attribute updates during resize
```

### 2. Column Container Node Extension
```typescript
- Define container node spec
- Allow only column children
- Parse and render container DOM
```

### 3. Resize Plugin (ProseMirror Plugin)
```typescript
- Track active resize handle position
- Handle mouse events (mousemove, mousedown, mouseup, mouseleave)
- Show/hide resize handles
- Update column widths during drag
- Enforce minimum column width
- Decorations for visual feedback
```

### 4. Keymap Plugin
```typescript
- Enter key: Create new paragraph or split column
- Mod+A: Select all content within current column
- Backspace/Delete: Handle column removal
- Arrow keys: Navigate between columns
```

### 5. Utility Functions
```typescript
- findBoundaryPosition(): Find resize handle position
- draggedWidth(): Calculate new width during drag
- updateColumnNodeWidth(): Update column attributes
- getColumnInfoAtPos(): Get column info at position
- addColumn(): Insert new column
- removeColumn(): Delete column
- exitColumn(): Move cursor out of column
```

## Commands to Implement

### Column Management Commands
1. **addColumn(containerPos?, columnIndex?)**: Add a new column
2. **removeColumn(pos)**: Remove column at position
3. **setColumnWidth(pos, width)**: Set specific column width
4. **exitColumn()**: Move cursor after column container
5. **selectColumn(pos)**: Select all content in column

### Usage in Editor
```typescript
// In your editor component
editor.commands.addColumn()
editor.commands.removeColumn()
editor.commands.setColumnWidth(100)
editor.commands.exitColumn()
```

## Styling Requirements

### CSS Classes
```css
.prosemirror-column-container
  - Display: flex
  - Gap between columns
  - Padding/margin as needed

.prosemirror-column
  - Flex basis based on colWidth
  - Min-width enforcement
  - Padding for content

.grid-resize-handle
  - Position: absolute between columns
  - Width: handle hit area
  - Cursor: col-resize
  - Visual indicator

.circle-button / .plus
  - Add column button
  - Show on hover
  - Click to add column

.resize-cursor
  - Applied to editor during resize
  - Cursor: col-resize
```

## Integration Steps

### Step 1: Setup Extension Files
- Create directory structure
- Set up TypeScript configuration
- Install required dependencies (@tiptap/core, prosemirror-*)

### Step 2: Implement Node Extensions
- Column node with attributes
- ColumnContainer node
- Test basic rendering

### Step 3: Implement Resize Plugin
- Mouse event handlers
- State management
- Decorations for handles
- Drag logic

### Step 4: Implement Keymap Plugin
- Enter key handling
- Selection handling
- Navigation

### Step 5: Add Commands
- Tiptap command interface
- Column management operations

### Step 6: Styling
- CSS for layout
- Resize handle styling
- Responsive considerations

### Step 7: Testing & Refinement
- Manual testing in editor
- Edge cases (min width, max columns, etc.)
- Performance optimization

## Dependencies Required

```json
{
  "@tiptap/core": "^2.x",
  "@tiptap/react": "^2.x",  // or @tiptap/pm for vanilla
  "prosemirror-state": "^1.x",
  "prosemirror-view": "^1.x",
  "prosemirror-model": "^1.x",
  "prosemirror-transform": "^1.x",
  "prosemirror-commands": "^1.x",
  "prosemirror-keymap": "^1.x"
}
```

## Next.js Specific Considerations

1. **Server-Side Rendering (SSR)**
   - Ensure extensions work with SSR
   - Dynamic imports for editor component
   - Disable SSR for interactive parts if needed

2. **Styling**
   - CSS Modules or Tailwind CSS
   - Global styles for ProseMirror basics
   - Component-scoped styles for columns

3. **TypeScript**
   - Strict typing for all extension methods
   - Type-safe commands
   - Proper type exports

4. **Performance**
   - Memoize expensive calculations
   - Debounce resize updates if needed
   - Efficient DOM updates

## Future Enhancements (Post-MVP)

1. **Column Presets**: 2-column, 3-column layouts
2. **Nesting**: Support nested column containers
3. **Responsive**: Mobile-friendly column stacking
4. **Background Colors**: Per-column background options
5. **Vertical Alignment**: Top, middle, bottom alignment
6. **Column Header**: Optional header section per column
7. **Drag & Drop**: Reorder columns via drag
8. **Context Menu**: Right-click options for columns

## Success Criteria

✅ Can add columns to editor
✅ Can remove columns
✅ Can resize columns with drag handles
✅ Content editable within columns
✅ Proper keyboard navigation
✅ Confluence-like UX
✅ TypeScript typed
✅ Works in Next.js environment
✅ Clean, maintainable code
