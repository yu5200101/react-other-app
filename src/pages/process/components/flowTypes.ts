export type PositionType = 'top' | 'right' | 'bottom' | 'left';
export type ResizeType = PositionType | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
export type NodeType = 'rectangle' | 'diamond' | 'circle';
export interface NodeData {
  id: string;
  strikeType: 'node' | 'edge'
  type?: NodeType
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  source?: string;
  sourceHandle?: PositionType
  target?: string;
  targetHandle?: PositionType
  points?: Array<PointData>
  boxLeft?: number
  boxTop?: number
  clientX?: number
  clientY?: number
}

export interface DragItem {
  type: 'node' | 'nodeType';
  id?: string;
  nodeType?: NodeType
}
export interface PositionXY {
  x: number
  y: number
}

export interface PointData extends PositionXY {
  type: PositionType
  id: string
}

export type PathAry = Array<PositionXY>

export interface PathParams {
  moveData: PositionXY,
  setCanvasSize: (data: PositionXY) => void,
  positionTL: PositionXY,
  setPositionTL: (data: PositionXY) => void,
  data: NodeData
}
