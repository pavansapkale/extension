import { Extension } from '@tiptap/core';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';

export interface ColumnResizeOptions {
  handleWidth: number;
  columnMinWidth: number;
}

interface ResizeStateData {
  active: boolean;
  columnPos: number | null;
  startX: number;
  startWidth: number;
}

export const createResizePlugin = (options: ColumnResizeOptions) => {
  const pluginKey = new PluginKey<ResizeStateData>('columnResize');

  return new Plugin<ResizeStateData>({
    key: pluginKey,
    state: {
      init() {
        return {
          active: false,
          columnPos: null,
          startX: 0,
          startWidth: 0,
        };
      },
      apply(tr, value) {
        if (tr.getMeta(pluginKey)) {
          return { ...value, ...tr.getMeta(pluginKey) };
        }
        return value;
      },
    },
    props: {
      handleDOMEvents: {
        mousedown(view, event) {
          const target = event.target as HTMLElement;
          if (!target.classList.contains('column-resize-handle')) {
            return false;
          }

          const columnElement = target.parentElement as HTMLElement;
          if (!columnElement) {
            return false;
          }

          const pos = view.posAtDOM(columnElement, 0);
          const state = view.state;
          const $pos = state.doc.resolve(pos);
          const node = $pos.node($pos.depth);

          if (!node || node.type.name !== 'column') {
            return false;
          }

          const currentWidth = node.attrs.colWidth || 200;
          
          view.dispatch(
            view.state.tr.setMeta(pluginKey, {
              active: true,
              columnPos: pos,
              startX: event.clientX,
              startWidth: currentWidth,
            })
          );

          const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            const resizeState = pluginKey.getState(view.state);
            if (!resizeState || !resizeState.active || resizeState.columnPos === null) {
              return;
            }

            const deltaX = e.clientX - resizeState.startX;
            let newWidth = resizeState.startWidth + deltaX;
            newWidth = Math.max(options.columnMinWidth, newWidth);

            const $currentPos = view.state.doc.resolve(resizeState.columnPos);
            const currentNode = $currentPos.node($currentPos.depth);

            if (currentNode && currentNode.type.name === 'column') {
              view.dispatch(
                view.state.tr.setNodeMarkup(
                  $currentPos.before($currentPos.depth),
                  null,
                  {
                    ...currentNode.attrs,
                    colWidth: newWidth,
                  }
                )
              );
            }
          };

          const handleMouseUp = () => {
            view.dispatch(
              view.state.tr.setMeta(pluginKey, {
                active: false,
                columnPos: null,
                startX: 0,
                startWidth: 0,
              })
            );
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);

          return true;
        },
      },
    },
  });
};
