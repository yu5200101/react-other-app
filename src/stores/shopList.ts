import { apiSlice } from '@/api/apiSlice'
import {
  createEntityAdapter
} from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { queryToString } from '@/utils/tools'
import type { DataItem } from '@/pages/shop/types'
import type { RootState } from './'
import { useAppSelector } from '@/stores/hook'
import { createStructuredSelector } from 'reselect';

// 1. 创建实体适配器
const listAdapter = createEntityAdapter<DataItem>({
  selectId: (item: DataItem) => item.id, // 确保指定 ID 字段
  sortComparer: (a, b) => a.price - b.price
})

const initialState = listAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getListByType: builder.query({
      query: (body) => ({
        url: `/getListByType?${queryToString(body)}`
      }),
      transformResponse: (responseData: any) => {
        return listAdapter.setAll(initialState, responseData.data)
      },
      // 单位秒，5分钟缓存时间
      keepUnusedDataFor: 5 * 60
    })
  })
})

export const {
  useGetListByTypeQuery
} = extendedApiSlice
// 调用 `someEndpoint.select(someArg)` 生成一个新的 selector，该 selector将返回
// 带有这些参数的查询的查询结果对象。
// 要为特定查询参数生成 selector，请调用 `select(theQueryArg)`。
// 在这种情况下，用户查询没有参数，所以我们不向 select() 传递任何内容
export const selectListByType = (body: any) =>
  extendedApiSlice.endpoints.getListByType.select(body);

export const makeSelectListData = (body: any) => {
  return createStructuredSelector({
    listData: (state: RootState) => selectListByType(body)(state).data
  })
}

// 创建带参数的实体选择器工厂函数
export const makeListSelectors = (body: any) => {
  const selectListData = makeSelectListData(body)

  return listAdapter.getSelectors(
    (state: RootState) => selectListData(state).listData ?? initialState
  )
}

// 带参数的 Hook
export const useList = (body: any) => {
  const selectors = useMemo(() => makeListSelectors(body), [body])
  return useAppSelector(selectors.selectAll)
}

// 带参数的 Hook
export const useListById = (body: any, id: string) => {
  const selectors = useMemo(() => makeListSelectors(body), [body])
  return useAppSelector((state) => selectors.selectById(state, id))
}