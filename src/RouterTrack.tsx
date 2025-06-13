// 创建路由上下文
import { useEffect } from 'react';
import { useLocation } from 'react-router';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // 是否需要登录
}

export default function RouteTracker({ children }: AuthRouteProps) {
  const location = useLocation();

  useEffect(() => {
    console.log('route change:', location.pathname);
  }, [location.pathname]);

  return <>{children}</>
}