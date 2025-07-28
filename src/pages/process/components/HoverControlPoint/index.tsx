import React, { useCallback, useEffect, useRef } from 'react'
import type { NodeData, PositionType, PositionXY } from '../flowTypes';
import styles from './index.module.scss'
import classnames from 'classnames'
import { SAFE_DISTANCE } from '../FlowEdge/handlePath'

interface HoverControlPointProps {
  isMove: boolean
  data: NodeData
  zIndex: number
  onClickEdgePoint: (
    data: NodeData,
    handleType: PositionType
  ) => void
  onNodeHover: (data: NodeData) => void
  onNodeClick: (id: string) => void;
  onSetMoveNode: (data: NodeData) => void
  onNodeMouseMove: (x: number, y: number, id: string) => void
}
const HoverControlPoint: React.FC<HoverControlPointProps> = React.memo(({
  isMove,
  data,
  zIndex,
  onClickEdgePoint,
  onNodeHover,
  onNodeClick,
  onSetMoveNode,
  onNodeMouseMove
}) => {
  const handleEdgePoint = useCallback((
    handleType: PositionType,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onClickEdgePoint(data, handleType);
  }, [onClickEdgePoint, data])

  const nodePosition = useRef<PositionXY>({x: 0, y: 0})
  const moveFlag = useRef<boolean>(false)

  const handleNodeMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    nodePosition.current.x = e.clientX - data.x
    nodePosition.current.y = e.clientY - data.y
    moveFlag.current = true
    onSetMoveNode(data)
  }, [onSetMoveNode, data])

  const handleNodeMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      if (!isMove || !moveFlag.current) {
        document.removeEventListener('mousemove', handleNodeMouseMove as any);
        document.removeEventListener('mouseup', handleNodeMouseMoveUp as any);
        return
      }
      onNodeClick('')
      const x = e.clientX - nodePosition.current.x
      const y = e.clientY - nodePosition.current.y
      onNodeMouseMove(x, y, data.id)
    })
  }, [onNodeMouseMove, data.id, isMove, onNodeClick])

  const clearData = useCallback(() => {
    nodePosition.current.x = 0
    nodePosition.current.y = 0
    moveFlag.current = false
    onSetMoveNode({} as NodeData)
  }, [onSetMoveNode])

  const handleNodeMouseMoveUp = useCallback(() => {
    clearData()
    onNodeClick(data.id)
  }, [clearData, data.id, onNodeClick])

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

  return <>
    <div
      style={{
        zIndex: zIndex + 1,
        left: data.x + SAFE_DISTANCE,
        top: data.y + SAFE_DISTANCE,
        width: data.width - SAFE_DISTANCE * 2,
        height: data.height - SAFE_DISTANCE * 2,
      }}
      onMouseDown={handleNodeMouseDown}
      onMouseEnter={() => {onNodeHover(data)}}
      onMouseLeave={() => {
        clearData()
        onNodeHover({} as NodeData)
      }}
      className={styles['box-hover-control']}>
        {/* 画线的4个小点 */}
        <div
          className={classnames(styles['node-control-point'], styles.top)}
          onMouseDown={(e) => handleEdgePoint('top', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.right)}
          onMouseDown={(e) => handleEdgePoint('right', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.bottom)}
          onMouseDown={(e) => handleEdgePoint('bottom', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.left)}
          onMouseDown={(e) => handleEdgePoint('left', e)}
        />
    </div>
  </>
})

export default HoverControlPoint