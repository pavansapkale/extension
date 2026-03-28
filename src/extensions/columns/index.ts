import { Node, mergeAttributes, Extension } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { PluginKey } from '@tiptap/pm/state';
import { createResizePlugin } from './plugins/resizePlugin';

export interface ColumnsOptions {
  HTMLAttributes: Record<string, any>;
  handleWidth: number;
  columnMinWidth: number;
  enableKeymap: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      /**
       * Insert a column container with specified number of columns
       */
      insertColumns: (columnsCount?: number) => ReturnType;
      /**
       * Remove the column container at the current position
       */
      removeColumns: () => ReturnType;
      /**
       * Add a column to the container at the current position
       */
      addColumn: () => ReturnType;
      /**
       * Delete the current column
       */
      deleteColumn: () => ReturnType;
    };
  }
}

export const Columns = Node.create<ColumnsOptions>({
  name: 'columns',
  group: 'block',
  content: 'column+',
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      handleWidth: 2,
      columnMinWidth: 50,
      enableKeymap: true,
    };
  },

  addAttributes() {
    return {
      layout: {
        default: 'default',
        parseHTML: element => element.getAttribute('data-layout') || 'default',
        renderHTML: attributes => ({
          'data-layout': attributes.layout || 'default',
        }),
      },
    };
  },

  addCommands() {
    return {
      insertColumns:
        (columnsCount: number = 2) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const { selection } = state;
          const { $from } = selection;

          // Create columns
          const columns = [];
          for (let i = 0; i < columnsCount; i++) {
            columns.push(
              state.schema.nodes.column.create(
                { colWidth: 200 },
                state.schema.nodes.paragraph.create()
              )
            );
          }

          // Create container
          const container = state.schema.nodes.columns.create(null, columns);

          if (dispatch) {
            const insertPos = $from.end($from.depth);
            tr.insert(insertPos + 1, container);

            // Set selection to first column
            const firstColumnPos = insertPos + 2;
            const SelectionClass = state.selection.constructor as any;
            tr.setSelection(SelectionClass.near(tr.doc.resolve(firstColumnPos)));

            return true;
          }
          return false;
        },

      removeColumns:
        () =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const { $from } = state.selection;
          
          // Find parent columns node
          let columnsPos = -1;
          let columnsDepth = -1;
          
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'columns') {
              columnsPos = $from.before(depth);
              columnsDepth = depth;
              break;
            }
          }

          if (columnsPos === -1) {
            return false;
          }

          if (dispatch) {
            tr.delete(columnsPos, $from.after(columnsDepth));
            return true;
          }
          return false;
        },

      addColumn:
        () =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const { $from } = state.selection;
          
          // Find parent columns node
          let columnsPos = -1;
          let columnsNode = null;
          
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'columns') {
              columnsPos = $from.before(depth);
              columnsNode = node;
              break;
            }
          }

          if (!columnsNode || columnsPos === -1) {
            return false;
          }

          if (dispatch) {
            const newColumn = state.schema.nodes.column.create(
              { colWidth: 200 },
              state.schema.nodes.paragraph.create()
            );
            
            const insertPos = columnsPos + 1 + columnsNode.content.size;
            tr.insert(insertPos, newColumn);
            return true;
          }
          return false;
        },

      deleteColumn:
        () =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const { $from } = state.selection;
          
          // Find parent column node
          let columnPos = -1;
          let columnDepth = -1;
          let columnsDepth = -1;
          
          for (let depth = $from.depth; depth > 0; depth--) {
            const node = $from.node(depth);
            if (node.type.name === 'column') {
              columnPos = $from.before(depth);
              columnDepth = depth;
            }
            if (node.type.name === 'columns') {
              columnsDepth = depth;
            }
          }

          if (columnPos === -1 || !columnsDepth) {
            return false;
          }

          if (dispatch) {
            tr.delete(columnPos, $from.after(columnDepth));
            return true;
          }
          return false;
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="columns"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'columns',
        class: 'prosemirror-columns',
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [
      createResizePlugin({
        handleWidth: this.options.handleWidth,
        columnMinWidth: this.options.columnMinWidth,
      }),
    ];
  },
});

// Re-export for convenience
export { Column } from './ColumnExtension';
export { ColumnContainer } from './ColumnContainerExtension';
export type { ColumnAttributes, ColumnsAttributes, ResizeState, ColumnResizeOptions } from './types';
