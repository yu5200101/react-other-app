import {
  HomeOutlined,
  // InfoCircleFilled,
  // PlusCircleFilled,
  // QuestionCircleFilled
  // SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
// import { Alert, Button, Input, Space } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router'
import defaultProps from './_defaultProps';
import rules from '@/utils/rules'
import storage from '@/utils/storage'

export default () => {
  const settings: ProSettings | undefined = {
    layout: 'mix',
    splitMenus: true
  };

  const location = useLocation()
  const navigate = useNavigate()
  const token = storage.localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token])

  const originPathName = useMemo(() => location.pathname, [location])
  const [pathname, setPathname] = useState(originPathName);

  const goToNextPage = (path: string) => {
    if (rules.verifyNetUrl.test(path)) {
      return
    }
    navigate(path)
    setPathname(path)
  }
  const openHome = () => {
    goToNextPage('/')
  }

  if (!token) return <></>

  return (
    <>
      <div
        id="test-pro-layout"
      >
        <ProLayout
          title="集萃华科"
          logo={<HomeOutlined />}
          onMenuHeaderClick={openHome}
          token={{
            header: {
              heightLayoutHeader: 50,
            },
          }}
          // headerRender={(props, defaultDom) => (
          //   <>
          //     <Alert
          //       message={
          //         <div
          //           style={{
          //             color: 'white',
          //           }}
          //         >
          //           本网站提供的部分服务在你当前浏览器中无法使用，建议你更换为
          //           Chrome 浏览器查看本网站。
          //         </div>
          //       }
          //       icon={
          //         <InfoCircleFilled
          //           style={{
          //             color: 'white',
          //           }}
          //         />
          //       }
          //       banner
          //       style={{
          //         backgroundColor: 'black',
          //       }}
          //       action={
          //         <Button
          //           type="text"
          //           style={{
          //             color: 'white',
          //           }}
          //         >
          //           查看详情
          //         </Button>
          //       }
          //     />
          //     {React.cloneElement(defaultDom as any, {
          //       style: {
          //         height: '56px',
          //         lineHeight: '56px',
          //       },
          //     })}
          //   </>
          // )}
          // footerRender={() => (
          //   <Space
          //     style={{
          //       height: 64,
          //       display: 'flex',
          //       justifyContent: 'end',
          //       alignItems: 'center',
          //       marginInlineEnd: 24,
          //     }}
          //   >
          //     <Button key="1">上一步</Button>
          //     <Button key="2" type="primary">
          //       保存
          //     </Button>
          //   </Space>
          // )}
          bgLayoutImgList={[
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              left: 85,
              bottom: 100,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
              bottom: -68,
              right: -45,
              height: '303px',
            },
            {
              src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
              bottom: 0,
              left: 0,
              width: '331px',
            },
          ]}
          {...defaultProps}
          location={{
            pathname,
          }}
          menu={{
            type: 'group',
          }}
          // avatarProps={{
          //   src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          //   size: 'small',
          //   title: '七妮妮',
          // }}
          // actionsRender={(props) => {
          //   if (props.isMobile) return [];
          //   return [
          //     props.layout !== 'side' && document.body.clientWidth > 1400 ? (
          //       <div
          //         key="SearchOutlined"
          //         aria-hidden
          //         style={{
          //           display: 'flex',
          //           alignItems: 'center',
          //           marginInlineEnd: 24,
          //         }}
          //         onMouseDown={(e) => {
          //           e.stopPropagation();
          //           e.preventDefault();
          //         }}
          //       >
          //         <Input
          //           style={{
          //             borderRadius: 4,
          //             marginInlineEnd: 12,
          //             backgroundColor: 'rgba(0,0,0,0.03)',
          //           }}
          //           prefix={
          //             <SearchOutlined
          //               style={{
          //                 color: 'rgba(0, 0, 0, 0.15)',
          //               }}
          //             />
          //           }
          //           placeholder="搜索方案"
          //           variant="borderless"
          //         />
          //         <PlusCircleFilled
          //           style={{
          //             color: 'var(--ant-primary-color)',
          //             fontSize: 24,
          //           }}
          //         />
          //       </div>
          //     ) : undefined,
          //     <InfoCircleFilled key="InfoCircleFilled" />,
          //     <QuestionCircleFilled key="QuestionCircleFilled" />,
          //   ];
          // }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return undefined;
            return (
              <div
                style={{
                  textAlign: 'center',
                  paddingBlockStart: 12,
                }}
              >
                <div>© 2025</div>
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <div
              onClick={(event) => {
                event.preventDefault()
                item.path && goToNextPage(item.path)
              }}
            >
              {dom}
            </div>
          )}
          {...settings}
        >
          <PageContainer>
            <ProCard
              style={{
                minHeight: 800,
              }}
            >
              <Outlet />
            </ProCard>
          </PageContainer>
        </ProLayout>
      </div>
    </>
  );
};