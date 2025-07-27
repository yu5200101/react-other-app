import type { NodeData, PositionXY } from '../flowTypes';

export const getHandlePosition = (
  node: NodeData
): PositionXY => {
  switch (node.sourceHandle) {
    case 'topLeft':
      return { x: node.x, y: node.y };
    case 'top':
      return { x: node.x + node.width / 2, y: node.y };
    case 'topRight':
      return { x: node.x + node.width, y: node.y };
    case 'right':
      return { x: node.x + node.width, y: node.y + node.height / 2 };
    case 'bottomRight':
      return { x: node.x + node.width, y: node.y + node.height };
    case 'bottom':
      return { x: node.x + node.width / 2, y: node.y + node.height };
    case 'bottomLeft':
      return { x: node.x, y: node.y + node.height };
    case 'left':
      return { x: node.x, y: node.y + node.height / 2 };
    default: {
      return {
        x: 0,
        y: 0
      }
    }
  }
};