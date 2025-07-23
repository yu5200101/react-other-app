export type PositionType = 'top' | 'right' | 'bottom' | 'left';
export interface NodeData {
  id: string;
  strikeType: 'node' | 'edge'
  type?: 'rectangle' | 'diamond' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  source?: string;
  sourceHandle?: PositionType
  target?: string;
  targetHandle?: PositionType
  points?: { x: number; y: number }[];
}

export interface DragItem {
  type: 'node' | 'nodeType';
  id?: string;
  nodeType?: 'rectangle' | 'diamond' | 'circle';
}

