import {
  LockOutlined,
  MobileOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText
} from '@ant-design/pro-components';
import { Tabs, message, theme } from 'antd';
import { useState } from 'react';
import styles from './index.module.scss'
import { getPushOpt } from '@/utils/navigate';
import { useNavigate } from 'react-router';
import type { TabsProps } from 'antd';
import storage from '@/utils/storage'

type LoginType = 'phone' | 'account';
interface AccountInfo {
  username: string
  password: string
}
interface PhoneInfo {
  mobile: string
  captcha: string
}
const Login: React.FC = () => {
  const { token: themeOptions } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('phone');
  const navigate = useNavigate()
  const goHome = (values: AccountInfo | PhoneInfo) => {
    const info = JSON.stringify(values)
    storage.localStorage.setItem('token', info)
    navigate(getPushOpt('/'))
  }
  const tabItems: TabsProps['items'] = [
    {
      key: 'account',
      label: '账号密码登录'
    },
    {
      key: 'phone',
      label: '手机号登录'
    }
  ];
  return (
    <ProConfigProvider hashed={false}>
      <div className={styles.container}>
        <LoginForm
          title="集萃华科"
          subTitle="工程教育课程平台"
          onFinish={goHome}
        >
          <Tabs
            centered
            activeKey={loginType}
            items={tabItems}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                  strengthText:
                    'Password should contain numbers, letters and special characters, at least 8 characters long.',
                  statusRender: (value) => {
                    const getStatus = () => {
                      if (value && value.length > 12) {
                        return 'ok';
                      }
                      if (value && value.length > 6) {
                        return 'pass';
                      }
                      return 'poor';
                    };
                    const status = getStatus();
                    if (status === 'pass') {
                      return (
                        <div style={{ color: themeOptions.colorWarning }}>
                          强度：中
                        </div>
                      );
                    }
                    if (status === 'ok') {
                      return (
                        <div style={{ color: themeOptions.colorSuccess }}>
                          强度：强
                        </div>
                      );
                    }
                    return (
                      <div style={{ color: themeOptions.colorError }}>强度：弱</div>
                    );
                  },
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          {loginType === 'phone' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={'prefixIcon'} />,
                }}
                name="mobile"
                placeholder={'请输入手机号'}
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${'获取验证码'}`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default Login