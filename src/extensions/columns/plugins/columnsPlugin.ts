import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createResizePlugin } from './resizePlugin';

export const ColumnsPluginKey = new PluginKey('columns');

export interface ColumnsOptions {
  handleWidth: number;
  columnMinWidth: number;
  enableKeymap: boolean;
}

export const createColumnsPlugin = (options: ColumnsOptions) => {
  return createResizePlugin({
    handleWidth: options.handleWidth,
    columnMinWidth: options.columnMinWidth,
  });
};
