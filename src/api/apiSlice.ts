// 从特定于 React 的入口点导入 RTK Query 方法
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { openLoginModal } from '@/stores/authSlice'
import storage from '@/utils/storage'
import { sleepTime } from '@/utils/tools'
import { isRetryError } from './tools'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// 定义后端响应格式
interface BackendResponse {
  code: number;
  message: string;
  data: object;
}

const ContentTypeEnum  = {
  JSON: 'application/json;charset=UTF-8',
  TEXT: 'text/plain;charset=UTF-8',
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}

const DEFAULT_TIMEOUT = 10 * 1000

// 原生基础查询
const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000',
  prepareHeaders: (headers) => {
    const token = storage.localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    // 在此处设置headers的优先级最低
    return headers
  },
  timeout: DEFAULT_TIMEOUT,
})

const baseQueryWithInterceptors: BaseQueryFn = async (args, api, extraOptions) => {
  // ----------------------------
  // 请求拦截器逻辑
  // ----------------------------
  console.log('请求拦截器：', args);
  // 示例：动态修改请求参数 在此处控制headers设置的优先级
  const modifiedArgs = {
    ...args,
    headers: {
      'content-type': ContentTypeEnum.JSON,
      ...args.headers
    }
  };

  // ----------------------------
  // 执行请求
  // ----------------------------
  let result = await rawBaseQuery(modifiedArgs, api, extraOptions);

  // ----------------------------
  // 响应拦截器逻辑
  // ----------------------------
  // 如果发生特定错误，则重试
  const errorObj = result.error as FetchBaseQueryError
  const retryData = isRetryError(errorObj)
  if (retryData.flag) {
    // 重试逻辑
    const maxRetries = retryData.maxRetries;
    let attempt = 1;
    while (attempt <= maxRetries) {
      // 指数退避策略
      const delay = Math.min(1000 * 2 ** attempt, 30000);
      await sleepTime(delay)
      result = await rawBaseQuery(args, api, extraOptions);
      if (!errorObj) break; // 成功则退出
      attempt++;
    }
  }

  // 处理网络错误或 HTTP 错误（如 4xx/5xx）
  if (errorObj) {
    return result; // 直接返回原生错误
  }

  // 解析业务响应
  const backendResponse = result.data as BackendResponse;
  if (backendResponse.code !== 0) {
    // 处理 401 未授权：清除令牌并跳转登录
    localStorage.removeItem('token');
    api.dispatch(openLoginModal(null))
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: backendResponse
      }
    }
  }

  // 业务状态码异常时，构造 RTK Query 错误对象
  if (backendResponse.code !== 0) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        data: backendResponse
      }
    }
  }

  // 业务状态码正常时，返回数据
  return { data: backendResponse };
};
// 定义我们的单个 API Slice 对象
export const apiSlice = createApi({
  // 缓存减速器预计将添加到 `state.api` （已经默认 - 这是可选的）
  reducerPath: 'api',
  // 我们所有的请求都有以 “/api 开头的 URL
  baseQuery: baseQueryWithInterceptors,
  // 全局配置重试
  refetchOnReconnect: true, // 网络重连时重试
  refetchOnFocus: true,    // 窗口聚焦时重试
  // “endpoints” 代表对该服务器的操作和请求
  endpoints: () => ({
    // `register` endpoint 是一个返回数据的 “Query” 操作
  })
})

// 为 `useRegisterMutation` mutation endpoint 导出自动生成的 hooks
// export const {  } = apiSlice