import React, { useState, useRef } from 'react';
import styles from './index.module.scss';
import FlowNode from '../FlowNode';
import FlowEdge from '../FlowEdge';
import Sidebar from '../Sidebar';
import { useImmer } from 'use-immer'
import type { NodeData, DragItem } from '../flowTypes';
import {
  SAFE_DISTANCE
} from '../FlowEdge/handlePath'

const FlowEditor: React.FC = () => {
  const [nodes, setNodes] = useImmer<NodeData[]>([]);
  const [clickNodeId, setClickNodeId] = useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [moveNode, setMoveNode] = useState<NodeData>({} as NodeData);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const [drawEdgeId, setDrawEdgeId] = useState<string>('')
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
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
  };

  const handleStartEdgeDrag = (
    data: NodeData,
    handleType: 'top' | 'right' | 'bottom' | 'left'
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
      const todo = draft.find((item) => item.id === data.id) as NodeData
      if (!Array.isArray(todo.points)) {
        todo.points = []
      }
      todo.points.push({type: handleType, id})
      draft.push(newEdge)
    })
  }

  const handleNodeMouseMove = (x: number, y: number, id: string) => {
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
  }
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (!target.className.includes('nodeCanvas')) {
      setClickNodeId('')
    }
  }
  const getIsDrawing = (id: string): boolean => {
    const todo = nodes.find((item) => item.id === id) as NodeData
    if (todo.source === moveNode.id) return true
    return false
  }

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
            key={node.id}
            data={node}
            zIndex={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default FlowEditor;
