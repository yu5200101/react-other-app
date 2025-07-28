import React, { useRef, useEffect } from 'react';
import styles from './index.module.scss';
import type { NodeData } from '../flowTypes';
import { SAFE_DISTANCE } from '../FlowEdge/handlePath'

interface FlowNodeProps {
  data: NodeData
  zIndex: number
  onNodeHover: (data: NodeData) => void;
}

const FlowNode: React.FC<FlowNodeProps> = React.memo(({
  data,
  zIndex,
  onNodeHover
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function drawRoundRect(ctx: any, width: number, height: number, radius: number) {
      ctx.beginPath();
      ctx.moveTo(radius, 0); // 左上角起点
      ctx.lineTo(width - radius, 0); // 右上边
      ctx.arcTo(width, 0, width, radius, radius); // 右上角圆角
      ctx.lineTo(width, height - radius); // 右下边
      ctx.arcTo(width, height, width - radius, height, radius); // 右下角圆角
      ctx.lineTo(radius, height); // 左下边
      ctx.arcTo(0, height, 0, height - radius, radius); // 左下角圆角
      ctx.lineTo(0, radius); // 左上边
      ctx.arcTo(0, 0, radius, 0, radius); // 左上角圆角
      ctx.closePath();
      ctx.stroke();
    }
    // Draw node based on type
    switch (data.type) {
      case 'rectangle':
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.fillRect(0, 0, data.width, data.height);
        ctx.strokeRect(SAFE_DISTANCE, SAFE_DISTANCE, data.width - SAFE_DISTANCE * 2, data.height - SAFE_DISTANCE * 2);
        break;
      case 'diamond':
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(data.width / 2, 0);
        ctx.lineTo(data.width, data.height / 2);
        ctx.lineTo(data.width / 2, data.height);
        ctx.lineTo(0, data.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'circle':
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, data.width, data.height, data.height / 2)
        break;
    }

    // Draw text if exists
    if (data.text) {
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(data.text, data.width / 2, data.height / 2);
    }
  }, [data]);

  const handleMouseDown = () => {
    console.log('handleMouseDown')
  }
  return (
    <div
      ref={nodeRef}
      id={data.id}
      className={styles.flowNode}
      // 相对于flowCanvas的定位
      style={{
        zIndex,
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => {onNodeHover(data)}}
      onMouseLeave={() => {
        onNodeHover({} as NodeData)
      }}
    >
      <canvas
        ref={canvasRef}
        width={data.width}
        height={data.height}
        className={styles.nodeCanvas}
      />
    </div>
  );
})

export default FlowNode;
