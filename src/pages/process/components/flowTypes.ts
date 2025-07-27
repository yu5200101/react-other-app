export type PositionType = 'top' | 'right' | 'bottom' | 'left';
export type AllPositionType = PositionType | 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft'
export type NodeType = 'rectangle' | 'diamond' | 'circle';

export interface SizeWH {
  width: number
  height: number
}

export interface PositionXY {
  x: number
  y: number
}

interface NodeBasicData {
  id: string;
  strikeType: 'node' | 'edge'
  type?: NodeType
  text?: string;
  source?: string;
  sourceHandle?: AllPositionType
  target?: string;
  targetHandle?: PositionType
  points?: Array<PointData>
  boxLeft: number
  boxTop: number
  clientX?: number
  clientY?: number
}
export type NodeData = PositionXY & SizeWH & NodeBasicData

export interface DragItem {
  type: 'node' | 'nodeType';
  id?: string;
  nodeType?: NodeType
}

interface PointBasic {
  type?: AllPositionType
  id?: string
}

export type PointData = PointBasic & PositionXY

export type ChangeType = keyof SizeWH | keyof PositionXY

export type ResizePoint = SizeWH & PositionXY & {
  id?: string
  changeType: Array<ChangeType>
}

export type ResizePosition = SizeWH & PositionXY & PointBasic

export type PathAry = Array<PositionXY>

export interface PathParams {
  moveData: PositionXY,
  setCanvasSize: (data: PositionXY) => void,
  positionTL: PositionXY,
  setPositionTL: (data: PositionXY) => void,
  data: NodeData
}
