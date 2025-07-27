import React, { useState, useRef, useCallback } from 'react';
import styles from './index.module.scss';
import FlowNode from '../FlowNode';
import FlowEdge from '../FlowEdge';
import Sidebar from '../Sidebar';
import { useImmer } from 'use-immer'
import type { NodeData, DragItem, PositionType, PointData } from '../flowTypes';
import {
  SAFE_DISTANCE
} from '../FlowEdge/handlePath'

const FlowEditor: React.FC = React.memo(() => {
  const [nodes, setNodes] = useImmer<NodeData[]>([]);
  const [clickNodeId, setClickNodeId] = useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [moveNode, setMoveNode] = useState<NodeData>({} as NodeData);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const [drawEdgeId, setDrawEdgeId] = useState<string>('')

  const handleDragStart = useCallback((e: React.DragEvent, item: DragItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    const item: DragItem = JSON.parse(data);
    const canvasBox = canvasBoxRef.current?.getBoundingClientRect();
    if (!canvasBox) return;

    if (item.type === 'nodeType') {
      const x = e.clientX - canvasBox.left;
      const y = e.clientY - canvasBox.top;

      const newNode: NodeData = {
        id: `node-${Date.now()}`,
        type: item.nodeType || 'rectangle',
        strikeType: 'node',
        x,
        y,
        width: 140,
        height: 92,
      };

      setNodes((draft) => {
        draft.push(newNode)
      })
    }
  }, [setNodes])

  const handleStartEdgeDrag = useCallback((
    data: NodeData,
    handleType: PositionType
  ) => {
    const canvasBox = canvasBoxRef.current?.getBoundingClientRect();
    if (!canvasBox) return
    const id = `edge-${Date.now()}`
    const newEdge: NodeData = {
      id,
      strikeType: 'edge',
      source: data.id,
      sourceHandle: handleType,
      boxLeft: canvasBox.left,
      boxTop: canvasBox.top,
      x: data.x + SAFE_DISTANCE,
      y: data.y + SAFE_DISTANCE,
      width: data.width - SAFE_DISTANCE * 2,
      height: data.height - SAFE_DISTANCE * 2
    };
    setDrawEdgeId(id)
    setNodes((draft) => {
      draft.push(newEdge)
    })
  }, [setDrawEdgeId, setNodes])

  const handleEdgeMouseUp = useCallback((x: number, y: number, data: NodeData) => {
    setNodes((draft) => {
      const edgeTodo = draft.find((item) => item.id === data.id) as NodeData
      if (edgeTodo) {
        edgeTodo.clientX = x
        edgeTodo.clientY = y
      }
      const todo = draft.find((item) => item.id === data.source) as NodeData
      if (!Array.isArray(todo.points)) {
        todo.points = []
      }
      const point = todo.points.find(item => item.type === data.sourceHandle) as PointData
      if (point) {
        point.x = x
        point.y = y
      } else {
        todo.points.push({
          type: data.sourceHandle as PositionType,
          id: data.id,
          x,
          y
        })
      }
    })
  }, [setNodes])

  const handleNodeMouseMove = useCallback((x: number, y: number, id: string) => {
    setNodes((draft) => {
      const todo = draft.find((item) => item.id === id) as NodeData
      if (todo) {
        todo.x = x
        todo.y = y
      }
      if (Array.isArray(todo.points)) {
        const edgeIdList = todo.points.map(item => item.id)
        edgeIdList.forEach(edgeId => {
          const edgeTodo = draft.find((item) => item.id === edgeId) as NodeData
          edgeTodo.x = x + SAFE_DISTANCE
          edgeTodo.y = y + SAFE_DISTANCE
        })
      }
    })
  }, [setNodes])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (!target.className.includes('nodeCanvas')) {
      setClickNodeId('')
    }
  }, [setClickNodeId])

  const getIsDrawing = useCallback((id: string): boolean => {
    const todo = nodes.find((item) => item.id === id) as NodeData
    if (todo.source === moveNode.id) return true
    return false
  }, [moveNode, nodes])

  return (
    <div className={styles.flowEditor}>
      <Sidebar onDragStart={handleDragStart} />
      <div
        ref={canvasBoxRef}
        className={styles.flowCanvas}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {nodes.map((node, index) => (
          node.strikeType === 'node' ?
          // 节点
          <FlowNode
            zIndex={index + 1}
            key={node.id}
            data={node}
            isMove={moveNode.id === node.id}
            isClick={clickNodeId === node.id}
            isHover={hoverNodeId === node.id}
            onNodeHover={setHoverNodeId}
            onNodeClick={setClickNodeId}
            onSetMoveNode={setMoveNode}
            onStartEdgeDrag={handleStartEdgeDrag}
            onNodeMouseMove={handleNodeMouseMove}
          /> :
          // 折线
          <FlowEdge
            isDrawing={drawEdgeId === node.id || getIsDrawing(node.id)}
            isNodeChangeForDraw={getIsDrawing(node.id)}
            onSetDrawEdgeId={setDrawEdgeId}
            onEdgeMouseUp={handleEdgeMouseUp}
            key={node.id}
            data={node}
            zIndex={index + 1}
          />
        ))}
      </div>
    </div>
  );
})

export default FlowEditor;
