import { apiSlice } from '@/api/apiSlice'
import {
  createSelector
} from '@reduxjs/toolkit'

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation({
      // 请求的 URL 是“/register
      query: (body) => ({
        method: 'POST',
        url: '/register',
        body,
        timeout: 20000
      })
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data
      })
    }),
    getUserInfo: builder.query({
      query: () => ({
        url: '/getUserInfo',
        // 在此处设置headers的优先级最高
        headers: {
          'X-Custom-Header': 'value2'
        }
      })
    })
  })
})

export const {
  useLoginMutation,
  useGetUserInfoQuery,
  useRegisterMutation
} = extendedApiSlice
// 调用 `someEndpoint.select(someArg)` 生成一个新的 selector，该 selector将返回
// 带有这些参数的查询的查询结果对象。
// 要为特定查询参数生成 selector，请调用 `select(theQueryArg)`。
// 在这种情况下，用户查询没有参数，所以我们不向 select() 传递任何内容
export const selectUsersResult = extendedApiSlice.endpoints.getUserInfo.select(null)

export const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)
