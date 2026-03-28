import { Node, mergeAttributes } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface ColumnOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    column: {
      /**
       * Insert a column at the given position
       */
      insertColumn: (position?: number, colWidth?: number) => ReturnType;
      /**
       * Remove the column at the given position
       */
      removeColumn: (position: number) => ReturnType;
      /**
       * Update column width
       */
      updateColumnWidth: (position: number, width: number) => ReturnType;
    };
  }
}

export const Column = Node.create<ColumnOptions>({
  name: 'column',
  
  content: 'block+',
  
  isolating: true,
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  addAttributes() {
    return {
      colWidth: {
        default: 200,
        parseHTML: element => {
          const width = element.getAttribute('data-col-width');
          return width ? parseInt(width, 10) : 200;
        },
        renderHTML: attributes => {
          if (!attributes.colWidth) {
            return {};
          }
          return {
            'data-col-width': attributes.colWidth,
            style: `width: ${attributes.colWidth}px`,
          };
        },
      },
    };
  },
  
  addCommands() {
    return {
      insertColumn:
        (position?: number, colWidth: number = 200) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          let pos = position;

          if (pos === undefined) {
            pos = state.selection.from;
          }

          const $pos = state.doc.resolve(pos);
          
          // Check if we're inside a columns container
          let containerPos = -1;
          for (let depth = $pos.depth; depth > 0; depth--) {
            const node = $pos.node(depth);
            if (node.type.name === 'columns') {
              containerPos = $pos.before(depth);
              break;
            }
          }

          if (containerPos === -1) {
            return false;
          }

          if (dispatch) {
            const column = state.schema.nodes.column.create(
              { colWidth },
              state.schema.nodes.paragraph.create()
            );
            
            // Find the position after the last column in the container
            const containerNode = state.doc.nodeAt(containerPos);
            if (containerNode) {
              const insertPos = containerPos + 1 + containerNode.content.size;
              tr.insert(insertPos, column);
              return true;
            }
          }
          return false;
        },

      removeColumn:
        (position: number) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const $pos = state.doc.resolve(position);
          const node = $pos.node($pos.depth);

          if (!node || node.type.name !== this.name) {
            return false;
          }

          if (dispatch) {
            tr.delete($pos.before($pos.depth), $pos.after($pos.depth));
            return true;
          }
          return false;
        },

      updateColumnWidth:
        (position: number, width: number) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          const $pos = state.doc.resolve(position);
          const node = $pos.node($pos.depth);

          if (!node || node.type.name !== this.name) {
            return false;
          }

          if (dispatch) {
            tr.setNodeMarkup($pos.before($pos.depth), null, {
              ...node.attrs,
              colWidth: width,
            });
            return true;
          }
          return false;
        },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'column',
        class: 'prosemirror-column',
      }),
      0,
    ];
  },

  addProseMirrorPlugins() {
    return [];
  },
});
