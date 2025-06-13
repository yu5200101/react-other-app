import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

// 判断是否可重试错误
export const isRetryError = (error: FetchBaseQueryError) => {
  if (!error) return {
    flag: false,
    maxRetries: 0
  };
  // 网络错误
  if (error.status === 'TIMEOUT_ERROR') {
    return {
      flag: true,
      maxRetries: 3
    }
  }
  // 服务器错误 (5xx)
  if (error.status === 'PARSING_ERROR' && typeof error.originalStatus === 'number' && error.originalStatus >= 500) {
    return {
      flag: true,
      maxRetries: 5
    }
  }
  // 特定客户端错误
  if (error.status === 'PARSING_ERROR' && [429, 409].includes(error.originalStatus)) {
    return {
      flag: true,
      maxRetries: 2
    }
  }
  return {
    flag: false,
    maxRetries: 0
  }
}