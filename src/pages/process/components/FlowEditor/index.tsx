import React, { useState, useRef } from 'react';
import styles from './index.module.scss';
import FlowNode from '../FlowNode';
import FlowEdge from '../FlowEdge';
import Sidebar from '../Sidebar';
import type { NodeData, DragItem } from '../flowTypes';

const FlowEditor: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);
  const [drawingId, setIsDrawingId] = useState<string>('')
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

      setNodes([...nodes, newNode]);
    }
  };

  const handleStartEdgeDrag = (
    data: NodeData,
    handleType: 'top' | 'right' | 'bottom' | 'left',
    x: number,
    y: number,
  ) => {
    const id = `edge-${Date.now()}`
    const newEdge: NodeData = {
      id,
      strikeType: 'edge',
      source: data.id,
      sourceHandle: handleType,
      points: [{x, y}],
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height
    };
    setIsDrawingId(id)
    setNodes([...nodes, newEdge]);
  };

  return (
    <div className={styles.flowEditor}>
      <Sidebar onDragStart={handleDragStart} />
      <div
        ref={canvasBoxRef}
        className={styles.flowCanvas}
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
            isSelected={selectedId === node.id}
            isHovered={hoverNodeId === node.id}
            onHover={setHoverNodeId}
            onSelect={setSelectedId}
            onStartEdgeDrag={handleStartEdgeDrag}
            onDragStart={handleDragStart}
          /> :
          // 折线
          <FlowEdge
            isDrawing={drawingId === node.id}
            onSetIsDrawing={setIsDrawingId}
            key={node.id} data={node} zIndex={index + 1}/>
        ))}
      </div>
    </div>
  );
};

export default FlowEditor;
