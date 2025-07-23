import React, { useRef, useEffect } from 'react';
import styles from './index.module.scss';
import type { NodeData, PositionType } from '../flowTypes';

interface FlowEdgeProps {
  data: NodeData;
  isDrawing: boolean
  zIndex: number,
  onSetIsDrawing: (val: boolean) => void
}

interface PositionXY {
  x: number
  y: number
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

type PathAry = Array<PositionXY>
// 根据移动方向生成路径
const generatePath = (startPoint: PositionXY, endPoint: PositionXY, direction: PositionType): PathAry => {
  const path = [startPoint];
  if (direction === 'top') {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    // 向上
    if (dy < 0) {
      if (dx > 5 || dx < -5) {
        // > 5 右 < -5 左
        if (Math.abs(dx) >= Math.abs(dy)) {
          path.push({ x: startPoint.x, y: endPoint.y });
        } else {
          const midY = startPoint.y - Math.abs(dy) / 2;
          path.push({x: startPoint.x, y: midY});
          path.push({x: endPoint.x, y: midY});
        }
        path.push(endPoint)
      } else {
        // 垂直向上
        path.push({x: startPoint.x, y: endPoint.y});
      }
      // 向下
    } else {
      path.push({ x: startPoint.x, y: startPoint.y - 20 });
      path.push({ x: endPoint.x, y: startPoint.y - 20 });
      path.push(endPoint);
    }
  }
  return path;
}
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {x, y} = getHandlePosition(data)

  const handleEdgeDrag = (e: MouseEvent) => {
    if (!isDrawing) {
      document.removeEventListener('mousemove', handleEdgeDrag as any);
      document.removeEventListener('mouseup', handleEndEdgeDrag as any);
      return
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // 根据当前方向生成路径
    const currentPath = generatePath({x, y}, { x: mouseX, y: mouseY }, data.sourceHandle as PositionType);
    // 绘制路径
    drawPath(ctx, currentPath);
  }

  const handleEndEdgeDrag = () => {
    console.log('handleEndEdgeDrag')
    onSetIsDrawing(false)
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
      className={styles.flowEdge}
      style={{
        zIndex
      }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default FlowEdge;
