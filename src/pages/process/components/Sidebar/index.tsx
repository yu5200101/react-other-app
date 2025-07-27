import React from 'react';
import styles from './index.module.scss';
import type { DragItem, NodeType } from '../flowTypes';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, item: DragItem) => void;
}

const nodeTypes = [
  { type: 'rectangle', label: '流程' },
  { type: 'diamond', label: '判定' },
  { type: 'circle', label: '开始/结束' },
];

const Sidebar: React.FC<SidebarProps> = React.memo(({ onDragStart }) => {
  return (
    <div className={styles.sidebar}>
      <h3>节点类型</h3>
      <div className={styles.nodeList}>
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className={styles.nodeType}
            draggable
            onDragStart={(e) =>
              onDragStart(e, { type: 'nodeType', nodeType: nodeType.type as NodeType })
            }
          >
            {nodeType.label}
          </div>
        ))}
      </div>
    </div>
  );
})

export default Sidebar;
