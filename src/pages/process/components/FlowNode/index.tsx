import React, { useRef, useEffect } from 'react';
import styles from './index.module.scss';
import type { NodeData, DragItem } from '../flowTypes';
import classnames from 'classnames'

interface FlowNodeProps {
  data: NodeData;
  zIndex: number
  isSelected: boolean;
  onSelect: (id: string) => void;
  isHovered: boolean;
  onHover: (id: string) => void;
  onStartEdgeDrag: (
    data: NodeData,
    handleType: 'top' | 'right' | 'bottom' | 'left'
  ) => void;
  onDragStart: (e: React.DragEvent, item: DragItem) => void;
}

const FlowNode: React.FC<FlowNodeProps> = ({
  data,
  isSelected,
  zIndex,
  onSelect,
  isHovered,
  onHover,
  onStartEdgeDrag,
  onDragStart,
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

    const isFlag = isSelected || isHovered

    function drawRoundRect(ctx: any, width: number, height: number, radius: number, color: string = '#3498db') {
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
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    // Draw node based on type
    switch (data.type) {
      case 'rectangle':
        ctx.fillStyle = isFlag ? '#e6f7ff' : '#fff';
        ctx.strokeStyle = isFlag ? '#1890ff' : '#333';
        ctx.lineWidth = 2;
        ctx.fillRect(0, 0, data.width, data.height);
        ctx.strokeRect(0, 0, data.width, data.height);
        break;
      case 'diamond':
        ctx.fillStyle = isFlag ? '#e6f7ff' : '#fff';
        ctx.strokeStyle = isFlag ? '#1890ff' : '#333';
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
        ctx.fillStyle = isFlag ? '#e6f7ff' : '#fff';
        ctx.lineWidth = 2;
        const color = isFlag ? '#1890ff' : '#333';
        drawRoundRect(ctx, data.width, data.height, data.height / 2, color)
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
  }, [data, isSelected, isHovered]);

  const handleHandleMouseDown = (
    handleType: 'top' | 'right' | 'bottom' | 'left',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onStartEdgeDrag(data, handleType);
  };

  return (
    <div
      ref={nodeRef}
      id={data.id}
      className={styles.flowNode}
      style={{
        zIndex: zIndex,
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
      }}
      onClick={() => onSelect(data.id)}
      onMouseEnter={() => onHover(data.id)}
      onMouseLeave={() => onHover('')}
      onDragStart={(e) => onDragStart(e, { type: 'node', id: data.id })}
    >
      <canvas
        ref={canvasRef}
        width={data.width}
        height={data.height}
        className={styles.nodeCanvas}
      />
      {/* 画折线的4个小圆点 */}
      {isHovered && (
        <>
          <div
            className={classnames(styles.handle, styles.top)}
            onMouseDown={(e) => handleHandleMouseDown('top', e)}
          />
          <div
            className={classnames(styles.handle, styles.right)}
            onMouseDown={(e) => handleHandleMouseDown('right', e)}
          />
          <div
            className={classnames(styles.handle, styles.bottom)}
            onMouseDown={(e) => handleHandleMouseDown('bottom', e)}
          />
          <div
            className={classnames(styles.handle, styles.left)}
            onMouseDown={(e) => handleHandleMouseDown('left', e)}
          />
        </>
      )}
    </div>
  );
};

export default FlowNode;
