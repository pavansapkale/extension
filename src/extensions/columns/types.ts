export interface ColumnAttributes {
  colWidth: number;
}

export interface ColumnsAttributes {
  layout: string;
}

export interface ResizeState {
  active: boolean;
  columnPos: number | null;
  startX: number;
  startWidth: number;
}

export interface ColumnOptions {
  HTMLAttributes: Record<string, any>;
}

export interface ColumnContainerOptions {
  HTMLAttributes: Record<string, any>;
}

export interface ColumnsOptions {
  HTMLAttributes: Record<string, any>;
  handleWidth: number;
  columnMinWidth: number;
  enableKeymap: boolean;
}

export interface ColumnResizeOptions {
  handleWidth: number;
  columnMinWidth: number;
}
