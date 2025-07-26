export type PositionType = 'top' | 'right' | 'bottom' | 'left';
export type ResizeType = PositionType | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
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
  points?: Array<{type: PositionType, id: string}>;
  boxLeft?: number
  boxTop?: number
}

export interface DragItem {
  type: 'node' | 'nodeType';
  id?: string;
  nodeType?: 'rectangle' | 'diamond' | 'circle';
}
export interface PositionXY {
  x: number
  y: number
}

export type PathAry = Array<PositionXY>

export interface PathParams {
  moveData: PositionXY,
  setCanvasSize: (data: PositionXY) => void,
  positionTL: PositionXY,
  setPositionTL: (data: PositionXY) => void,
  data: NodeData
}
