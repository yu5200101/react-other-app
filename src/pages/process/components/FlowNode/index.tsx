import React, { useRef, useEffect } from 'react';
import styles from './index.module.scss';
import type { NodeData, DragItem, PositionType, ResizeType } from '../flowTypes';
import classnames from 'classnames'
import {
  SAFE_DISTANCE
} from '../FlowEdge/handlePath'

interface FlowNodeProps {
  data: NodeData;
  zIndex: number
  isSelected: boolean;
  onSelect: (id: string) => void;
  isHovered: boolean;
  onHover: (id: string) => void;
  onStartEdgeDrag: (
    data: NodeData,
    handleType: PositionType,
    x: number,
    y: number
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
        ctx.strokeRect(SAFE_DISTANCE, SAFE_DISTANCE, data.width - 20, data.height - 20);
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

  const handlePoint = (
    handleType: PositionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onStartEdgeDrag(data, handleType, e.clientX, e.clientY);
  };
  const handleResize = (
    handleType: ResizeType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // onStartEdgeDrag(data, handleType);
  };

  return (
    <div
      ref={nodeRef}
      id={data.id}
      className={styles.flowNode}
      // 相对于flowCanvas的定位
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
            onMouseDown={(e) => handlePoint('top', e)}
          />
          <div
            className={classnames(styles.handle, styles.right)}
            onMouseDown={(e) => handlePoint('right', e)}
          />
          <div
            className={classnames(styles.handle, styles.bottom)}
            onMouseDown={(e) => handlePoint('bottom', e)}
          />
          <div
            className={classnames(styles.handle, styles.left)}
            onMouseDown={(e) => handlePoint('left', e)}
          />
        </>
      )}
      {/* 调整大小的8个小点 */}
      {isSelected && (
        <>
          <div
            className={classnames(styles.handle,
              styles.rect, styles['top-left'])}
            onMouseDown={(e) => handleResize('topLeft', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles.top)}
            onMouseDown={(e) => handleResize('top', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles['top-right'])}
            onMouseDown={(e) => handleResize('topRight', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.right)}
            onMouseDown={(e) => handleResize('right', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles['bottom-right'])}
            onMouseDown={(e) => handleResize('bottomRight', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.bottom)}
            onMouseDown={(e) => handleResize('bottom', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles['bottom-left'])}
            onMouseDown={(e) => handleResize('bottomLeft', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.left)}
            onMouseDown={(e) => handleResize('left', e)}
          />
        </>
      )}
    </div>
  );
};

export default FlowNode;
