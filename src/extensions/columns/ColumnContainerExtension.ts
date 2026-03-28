import { Node, mergeAttributes } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';

export interface ColumnContainerOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnContainer: {
      /**
       * Insert a column container with specified number of columns
       */
      insertColumnContainer: (position?: number, columnsCount?: number) => ReturnType;
      /**
       * Remove the column container at the given position
       */
      removeColumnContainer: (position: number) => ReturnType;
    };
  }
}

export const ColumnContainer = Node.create<ColumnContainerOptions>({
  name: 'column_container',
  
  group: 'block',
  content: 'column+',
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  addCommands() {
    return {
      insertColumnContainer:
        (position?: number, columnsCount: number = 2) =>
        ({ tr, state, dispatch }: { tr: Transaction; state: EditorState; dispatch: any }) => {
          let pos = position;

          if (pos === undefined) {
            pos = state.selection.from;
          }

          const $pos = state.doc.resolve(pos);
          
          const columns = [];
          for (let i = 0; i < columnsCount; i++) {
            columns.push(
              state.schema.nodes.column.create(
                { colWidth: 200 },
                state.schema.nodes.paragraph.create()
              )
            );
          }

          const container = state.schema.nodes.column_container.create(
            null,
            columns
          );

          if (dispatch) {
            const insertPos = $pos.end($pos.depth);
            tr.insert(insertPos + 1, container);
            
            const firstColumnPos = insertPos + 2;
            const SelectionClass = state.selection.constructor as any;
            tr.setSelection(SelectionClass.near(tr.doc.resolve(firstColumnPos)));
            
            return true;
          }
          return false;
        },

      removeColumnContainer:
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.prosemirror-column-container',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'prosemirror-column-container',
      }),
      0,
    ];
  },
});
