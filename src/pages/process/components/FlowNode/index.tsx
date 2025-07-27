import React, { useRef, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import type { NodeData, PositionType, ResizeType, PositionXY } from '../flowTypes';
import classnames from 'classnames'
import {
  SAFE_DISTANCE
} from '../FlowEdge/handlePath'

interface FlowNodeProps {
  data: NodeData;
  zIndex: number
  isClick: boolean;
  onNodeClick: (id: string) => void;
  isHover: boolean;
  onNodeHover: (id: string) => void;
  isMove: boolean;
  onNodeMouseMove: (x: number, y: number, id: string) => void
  onStartEdgeDrag: (
    data: NodeData,
    handleType: PositionType
  ) => void
  onSetMoveNode: (data: NodeData) => void
}

const FlowNode: React.FC<FlowNodeProps> = React.memo(({
  data,
  isClick,
  zIndex,
  onNodeClick,
  isHover,
  onNodeHover,
  isMove,
  onSetMoveNode,
  onNodeMouseMove,
  onStartEdgeDrag,

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

  const handlePoint = useCallback((
    handleType: PositionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onStartEdgeDrag(data, handleType);
  }, [onStartEdgeDrag, data])

  const handleResize = useCallback((
    handleType: ResizeType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // onStartEdgeDrag(data, handleType);
  }, [])

  const nodePosition = useRef<PositionXY>({x: 0, y: 0})

  const handleNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    nodePosition.current.x = e.clientX - data.x
    nodePosition.current.y = e.clientY - data.y
    onSetMoveNode(data)
  }, [onSetMoveNode, data])

  const handleNodeMouseMove = useCallback((e: MouseEvent) => {
    if (!isMove) {
      document.removeEventListener('mousemove', handleNodeMouseMove as any);
      document.removeEventListener('mouseup', handleNodeMouseUp as any);
      return
    }
    const moveX = e.clientX - nodePosition.current.x
    const moveY = e.clientY - nodePosition.current.y
    onNodeMouseMove(moveX, moveY, data.id)
  }, [onNodeMouseMove, data.id, isMove])

  const handleNodeMouseUp = useCallback(() => {
    nodePosition.current.x = 0
    nodePosition.current.y = 0
    onSetMoveNode({} as NodeData)
  }, [onSetMoveNode])

    useEffect(() => {
      if (data.id) {
        document.addEventListener('mousemove', handleNodeMouseMove as any);
        document.addEventListener('mouseup', handleNodeMouseUp as any);
        return () => {
          document.removeEventListener('mousemove', handleNodeMouseMove as any);
          document.removeEventListener('mouseup', handleNodeMouseUp as any);
        };
      }
    }, [data.id, isMove]);

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
      onClick={() => onNodeClick(data.id)}
      onMouseDown={handleNodeMouseDown}
      onMouseEnter={() => onNodeHover(data.id)}
      onMouseLeave={() => onNodeHover('')}
    >
      <canvas
        ref={canvasRef}
        width={data.width}
        height={data.height}
        className={styles.nodeCanvas}
      />
      {/* 画折线的4个小圆点 */}
      {isHover && (
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
      {isClick && (
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
})

export default FlowNode;
