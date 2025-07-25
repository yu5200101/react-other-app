import React, { useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';
import type { NodeData, PositionType, PositionXY, PathAry } from '../flowTypes';
import {
  SAFE_DISTANCE,
  handleTopPath,
  handleRightPath,
  handleLeftPath,
  handleBottomPath
} from './handlePath'

interface FlowEdgeProps {
  data: NodeData;
  isDrawing: boolean
  zIndex: number,
  onSetIsDrawing: (val: string) => void
}

const getHandlePosition = (
  node: NodeData
): PositionXY => {
  switch (node.sourceHandle) {
    case 'top':
      return { x: node.x + node.width / 2, y: node.y };
    case 'right':
      return { x: node.x + node.width, y: node.y + node.height / 2 };
    case 'bottom':
      return { x: node.x + node.width / 2, y: node.y + node.height };
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

// 绘制箭头
const drawArrow = (ctx: CanvasRenderingContext2D, from: PositionXY, to: PositionXY) => {
  const headLength = 15; // 箭头长度
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke();
}

 // 绘制带箭头的路径
const drawPath = (ctx: CanvasRenderingContext2D, path: PathAry) => {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 在终点绘制箭头
  drawArrow(ctx, path[path.length - 2], path[path.length - 1]);
}

const FlowEdge: React.FC<FlowEdgeProps> = ({
  data, zIndex, isDrawing, onSetIsDrawing }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {x, y} = getHandlePosition(data)
  const [positionTL, setPositionTL] = useState<PositionXY>({x: x, y: y})
  const [canvasSize, setCanvasSize] = useState<PositionXY>({x: SAFE_DISTANCE, y: SAFE_DISTANCE})

  // 根据移动方向生成路径
// startPoint,endPoint都是相对于画板所在的位置，需要转换成针对当前canvas所在的位置
  const generatePath = (moveData: PositionXY, direction: PositionType): PathAry => {
    const lib = {
      top: handleTopPath,
      right: handleRightPath,
      bottom: handleBottomPath,
      left: handleLeftPath
    }
    return lib[direction] && lib[direction]({
      moveData,
      setCanvasSize,
      setPositionTL,
      positionTL,
      data
    })
  }

  const handleEdgeDrag = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      if (!isDrawing) {
        document.removeEventListener('mousemove', handleEdgeDrag as any);
        document.removeEventListener('mouseup', handleEndEdgeDrag as any);
        return
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const moveX = e.clientX - data.points[0].x
      const moveY = e.clientY - data.points[0].y
      // 根据当前方向生成路径
      const currentPath = generatePath({ x: moveX, y: moveY }, data.sourceHandle as PositionType);
      requestAnimationFrame(() => {
        drawPath(ctx, currentPath)
      })
    })
  }

  const handleEndEdgeDrag = () => {
    onSetIsDrawing('')
  }

  useEffect(() => {
    if (data.id) {
      document.addEventListener('mousemove', handleEdgeDrag as any);
      document.addEventListener('mouseup', handleEndEdgeDrag as any);
      return () => {
        document.removeEventListener('mousemove', handleEdgeDrag as any);
        document.removeEventListener('mouseup', handleEndEdgeDrag as any);
      };
    }
  }, [data.id, isDrawing]);
  return (
    <div
      ref={nodeRef}
      className={styles.flowEdge}
      style={{
        zIndex,
        // 相对于flowCanvas的定位
        left: positionTL.x,
        top: positionTL.y,
        width: canvasSize.x,
        height: canvasSize.y,
      }}>
      <canvas
        ref={canvasRef}
        className={styles['canvas-box']}
        width={canvasSize.x}
        height={canvasSize.y}
        style={{
          width: canvasSize.x,
          height: canvasSize.y
        }}
      />
    </div>
  );
};

export default FlowEdge;
