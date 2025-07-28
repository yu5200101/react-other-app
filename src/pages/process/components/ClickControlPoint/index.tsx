import React, { useCallback, useEffect, useRef } from 'react'
import type { NodeData, AllPositionType, PositionXY, ResizePosition, ChangeType, ResizePoint } from '../flowTypes';
import styles from './index.module.scss'
import classnames from 'classnames'
import { SAFE_DISTANCE } from '../FlowEdge/handlePath'
import { getHandlePosition } from '../modules/utils'

interface HoverControlPointProps {
  isResize: boolean
  data: NodeData
  zIndex: number
  onNodeHover: (data: NodeData) => void
  onSetResizeNode: (data: NodeData) => void
  onNodeMouseResize: (resizeData: ResizePoint) => void
}
const HoverControlPoint: React.FC<HoverControlPointProps> = React.memo(({
  isResize,
  data,
  zIndex,
  onNodeHover,
  onSetResizeNode,
  onNodeMouseResize
}) => {

  const nodePosition = useRef<PositionXY>({x: 0, y: 0})
  const moveFlag = useRef<boolean>(false)

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
    moveFlag.current = true
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
      if (!isResize || !moveFlag.current) {
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
    moveFlag.current = false
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
  return <>
    <div
      style={{
        zIndex: zIndex + 1,
        left: data.x + SAFE_DISTANCE,
        top: data.y + SAFE_DISTANCE,
        width: data.width - SAFE_DISTANCE * 2,
        height: data.height - SAFE_DISTANCE * 2,
      }}
      onMouseEnter={() => {onNodeHover(data)}}
      onMouseLeave={() => {
        onNodeHover({} as NodeData)
      }}
      className={styles['box-click-control']}>
        {/* 调整大小的8个小点 */}
        <div
          className={classnames(styles['node-control-point'],
            styles.rect, styles['top-left'], styles.nwse)}
          onMouseDown={(e) => handleResizePoint('topLeft', e)}
        />
        <div
          className={classnames(styles['node-control-point'],
            styles.rect, styles.top, styles.ns)}
          onMouseDown={(e) => handleResizePoint('top', e)}
        />
        <div
          className={classnames(styles['node-control-point'],
            styles.rect, styles['top-right'], styles.nesw)}
          onMouseDown={(e) => handleResizePoint('topRight', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.rect, styles.right, styles.ew)}
          onMouseDown={(e) => handleResizePoint('right', e)}
        />
        <div
          className={classnames(styles['node-control-point'],
            styles.rect, styles['bottom-right'], styles.nwse)}
          onMouseDown={(e) => handleResizePoint('bottomRight', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.rect, styles.bottom, styles.ns)}
          onMouseDown={(e) => handleResizePoint('bottom', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.rect, styles['bottom-left'], styles.nesw)}
          onMouseDown={(e) => handleResizePoint('bottomLeft', e)}
        />
        <div
          className={classnames(styles['node-control-point'], styles.rect, styles.left, styles.ew)}
          onMouseDown={(e) => handleResizePoint('left', e)}
        />
    </div>
  </>
})

export default HoverControlPoint