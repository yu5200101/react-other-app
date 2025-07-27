import React, { useRef, useEffect, useCallback } from 'react';
import styles from './index.module.scss';
import type { NodeData, PositionType, AllPositionType, PositionXY, ResizePoint, ResizePosition, ChangeType } from '../flowTypes';
import classnames from 'classnames'
import {
  SAFE_DISTANCE
} from '../FlowEdge/handlePath'
import { getHandlePosition } from '../modules/utils'

interface FlowNodeProps {
  data: NodeData
  zIndex: number
  isClick: boolean
  onNodeClick: (id: string) => void;
  isHover: boolean;
  onNodeHover: (id: string) => void;
  isMove: boolean
  onNodeMouseMove: (x: number, y: number, id: string) => void
  onSetMoveNode: (data: NodeData) => void
  isResize: boolean
  onNodeMouseResize: (resizeData: ResizePoint) => void
  onSetResizeNode: (data: NodeData) => void
  onClickEdgePoint: (
    data: NodeData,
    handleType: PositionType
  ) => void
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
  isResize,
  onSetResizeNode,
  onNodeMouseResize,
  onClickEdgePoint
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

  const handleEdgePoint = useCallback((
    handleType: PositionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onClickEdgePoint(data, handleType);
  }, [onClickEdgePoint, data])

  const nodePosition = useRef<PositionXY>({x: 0, y: 0})

  const handleNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    nodePosition.current.x = e.clientX - data.x
    nodePosition.current.y = e.clientY - data.y
    onSetMoveNode(data)
  }, [onSetMoveNode, data])

  const handleNodeMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      if (!isMove) {
        document.removeEventListener('mousemove', handleNodeMouseMove as any);
        document.removeEventListener('mouseup', handleNodeMouseMoveUp as any);
        return
      }
      const x = e.clientX - nodePosition.current.x
      const y = e.clientY - nodePosition.current.y
      onNodeMouseMove(x, y, data.id)
    })
  }, [onNodeMouseMove, data.id, isMove])

  const handleNodeMouseMoveUp = useCallback(() => {
    nodePosition.current.x = 0
    nodePosition.current.y = 0
    onSetMoveNode({} as NodeData)
  }, [onSetMoveNode])

  useEffect(() => {
    if (data.id) {
      document.addEventListener('mousemove', handleNodeMouseMove as any);
      document.addEventListener('mouseup', handleNodeMouseMoveUp as any);
      return () => {
        document.removeEventListener('mousemove', handleNodeMouseMove as any);
        document.removeEventListener('mouseup', handleNodeMouseMoveUp as any);
      };
    }
  }, [data.id, isMove]);

  const nodeResizePosition = useRef<ResizePosition>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    type: '' as AllPositionType
  })

  const handleResizePoint = useCallback((
    handleType: AllPositionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    const pointData: NodeData = {
      ...data,
      sourceHandle: handleType,
      // 可见box距离左侧距离
      x: data.x + SAFE_DISTANCE,
      // 可见box距离上边距离
      y: data.y + SAFE_DISTANCE,
      // 可见box的宽
      width: data.width - SAFE_DISTANCE * 2,
      // 可见box的高
      height: data.height - SAFE_DISTANCE * 2
    }
    const {x, y} = getHandlePosition(pointData)
    // 控制定位
    nodePosition.current.x = e.clientX - data.x
    nodePosition.current.y = e.clientY - data.y
    // 控制尺寸
    nodeResizePosition.current.x = data.boxLeft + x
    nodeResizePosition.current.y = data.boxTop + y
    nodeResizePosition.current.width = data.width
    nodeResizePosition.current.height = data.height
    nodeResizePosition.current.type = handleType
    onSetResizeNode(data)
  }, [data, onSetResizeNode])

  const handleNodeMouseResizeMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      if (!isResize) {
        document.removeEventListener('mousemove', handleNodeMouseResizeMove as any);
        document.removeEventListener('mouseup', handleNodeMouseResizeUp as any);
        return
      }
      let width = 0
      let height = 0
      const x = e.clientX - nodePosition.current.x
      const y = e.clientY - nodePosition.current.y
      const moveX = e.clientX - nodeResizePosition.current.x
      const moveY = e.clientY - nodeResizePosition.current.y
      const changeType = [] as Array<ChangeType>
      if (nodeResizePosition.current.type === 'left') {
        width = nodeResizePosition.current.width - moveX
        changeType.push('width', 'x')
      }
      if (nodeResizePosition.current.type === 'topLeft') {
        width = nodeResizePosition.current.width - moveX
        height = nodeResizePosition.current.height - moveY
        changeType.push('width', 'height', 'x', 'y')
      }
      if (nodeResizePosition.current.type === 'top') {
        height = nodeResizePosition.current.height - moveY
        changeType.push('height', 'y')
      }
      if (nodeResizePosition.current.type === 'topRight') {
        width = nodeResizePosition.current.width + moveX
        height = nodeResizePosition.current.height - moveY
        changeType.push('width', 'height', 'y')
      }
      if (nodeResizePosition.current.type === 'right') {
        width = nodeResizePosition.current.width + moveX
        changeType.push('width')
      }
      if (nodeResizePosition.current.type === 'bottomRight') {
        width = nodeResizePosition.current.width + moveX
        height = nodeResizePosition.current.height + moveY
        changeType.push('width', 'height')
      }
      if (nodeResizePosition.current.type === 'bottom') {
        height = nodeResizePosition.current.height + moveY
        changeType.push('height')
      }
      if (nodeResizePosition.current.type === 'bottomLeft') {
        width = nodeResizePosition.current.width - moveX
        height = nodeResizePosition.current.height + moveY
        changeType.push('width', 'height', 'x')
      }
      onNodeMouseResize({
        width,
        height,
        id: data.id,
        x,
        y,
        changeType
      })
    })
  }, [onNodeMouseResize, data.id, isResize])

  const handleNodeMouseResizeUp = useCallback(() => {
    nodePosition.current.x = 0
    nodePosition.current.y = 0
    nodeResizePosition.current.x = 0
    nodeResizePosition.current.y = 0
    nodeResizePosition.current.width = 0
    nodeResizePosition.current.height = 0
    nodeResizePosition.current.type = '' as AllPositionType
    onSetResizeNode({} as NodeData)
  }, [onSetResizeNode])

  useEffect(() => {
    if (data.id) {
      document.addEventListener('mousemove', handleNodeMouseResizeMove as any);
      document.addEventListener('mouseup', handleNodeMouseResizeUp as any);
      return () => {
        document.removeEventListener('mousemove', handleNodeMouseResizeMove as any);
        document.removeEventListener('mouseup', handleNodeMouseResizeUp as any);
      };
    }
  }, [data.id, isResize]);

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
            onMouseDown={(e) => handleEdgePoint('top', e)}
          />
          <div
            className={classnames(styles.handle, styles.right)}
            onMouseDown={(e) => handleEdgePoint('right', e)}
          />
          <div
            className={classnames(styles.handle, styles.bottom)}
            onMouseDown={(e) => handleEdgePoint('bottom', e)}
          />
          <div
            className={classnames(styles.handle, styles.left)}
            onMouseDown={(e) => handleEdgePoint('left', e)}
          />
        </>
      )}
      {/* 调整大小的8个小点 */}
      {isClick && (
        <>
          <div
            className={classnames(styles.handle,
              styles.rect, styles['top-left'], styles.nwse)}
            onMouseDown={(e) => handleResizePoint('topLeft', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles.top, styles.ns)}
            onMouseDown={(e) => handleResizePoint('top', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles['top-right'], styles.nesw)}
            onMouseDown={(e) => handleResizePoint('topRight', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.right, styles.ew)}
            onMouseDown={(e) => handleResizePoint('right', e)}
          />
          <div
            className={classnames(styles.handle,
              styles.rect, styles['bottom-right'], styles.nwse)}
            onMouseDown={(e) => handleResizePoint('bottomRight', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.bottom, styles.ns)}
            onMouseDown={(e) => handleResizePoint('bottom', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles['bottom-left'], styles.nesw)}
            onMouseDown={(e) => handleResizePoint('bottomLeft', e)}
          />
          <div
            className={classnames(styles.handle, styles.rect, styles.left, styles.ew)}
            onMouseDown={(e) => handleResizePoint('left', e)}
          />
        </>
      )}
    </div>
  );
})

export default FlowNode;
