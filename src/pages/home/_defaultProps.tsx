import {
  ChromeFilled,
  FormOutlined,
  PicCenterOutlined,
  DatabaseOutlined,
  GatewayOutlined,
  HomeOutlined,
  BarsOutlined
} from '@ant-design/icons';
export default {
  route: {
    path: '/home',
    children: [
      {
        path: '/home/data-processing',
        name: '数据加工',
        icon: <DatabaseOutlined />,
        children: [
          {
            path: '/home/data-processing/teaching',
            name: '教学',
            icon: <BarsOutlined />
          }, {
            path: '/home/data-processing/trial',
            name: '测试',
            icon: <FormOutlined />
          }
        ],
      },
      {
        path: '/home/three-coordinate-detection',
        name: '三坐标检测',
        icon: <PicCenterOutlined />,
        access: 'canAdmin',
        children: [
          {
            path: '/home/three-coordinate-detection/teaching',
            name: '教学',
            icon: <BarsOutlined />
          }, {
            path: '/home/three-coordinate-detection/trial',
            name: '测试',
            icon: <FormOutlined />
          }
        ],
      },
      {
        path: '/home/welding',
        name: '焊接',
        icon: <GatewayOutlined />,
        children: [
          {
            path: '/home/welding/teaching',
            name: '教学',
            icon: <BarsOutlined />
          }, {
            path: '/home/welding/trial',
            name: '测试',
            icon: <FormOutlined />
          }
        ],
      },
      {
        path: 'https://www.baidu.com',
        name: '官网外链',
        icon: <ChromeFilled />,
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: <HomeOutlined />,
      title: 'HomeOutlined',
      desc: 'home',
      url: 'https://www.baidu.com',
    }
  ]
}