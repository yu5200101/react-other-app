import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import styles from './index.module.scss'
import lodash from '@/utils/lodash'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'sub1',
    label: '第一章 坐标测量机介绍',
    children: [
      {
        key: 'g11',
        label: '测量机结构',
      },
      {
        key: 'g12',
        label: '准正控制器',
      },
      {
        key: 'g13',
        label: '测头系统',
      },
      {
        key: 'g14',
        label: '软件系统',
      },
      {
        key: 'g15',
        label: '测量机工作环境',
        children: [{
          key: 'g151',
          label: '精度影响因素',
        }, {
          key: 'g152',
          label: '使用环境'
        }]
      },
    ],
  },
  {
    key: 'sub2',
    label: '第二章 软件',
    children: [
      {
        key: 'g21',
        label: '软件界面简介',
      },
      {
        key: 'g22',
        label: '菜单栏',
      },
      {
        key: 'g23',
        label: '文件',
      },
      {
        key: 'g24',
        label: '设备',
      },
      {
        key: 'g25',
        label: '工具'
      },
    ],
  }
];

const Teaching: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  const defaultOpenKeys: Array<string> = useMemo(() => {
    const result: Array<string> = []
    const calKeys = (node: MenuItem) => {
      if (!node) return
      const children = lodash.get(node, 'children') || []
      if (!children.length) return
      if (children.length) {
        node.key && result.push(node.key as string)
      }
      children.forEach((child: MenuItem) => {
        calKeys(child)
      })
    }
    items.forEach(item => {
      calKeys(item)
    })
    return result
  }, [items])

  return (
    <div>
      <h1 className={styles.header}>课程目录</h1>
      <Menu
        onClick={onClick}
        style={{
          width: '100%',
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default Teaching;