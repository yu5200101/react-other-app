import {
  createSlice,
  nanoid,
  createSelector
} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/stores'

interface DataItem {
  id: string
  title: string
  content: string
  user: string
}
// 为 slice state 定义一个类型
interface CounterState {
  list: Array<DataItem>
  status: string
  error: string
}

// 使用该类型定义初始 state
const initialState: CounterState = {
  status: '',
  error: '',
  list: []
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setArticle: {
      reducer(state, action: PayloadAction<DataItem>) {
        const {id, title, content} = action.payload
        const temp: DataItem | undefined = state.list.find(item => item.id === id)
        if (temp) {
          temp.title = title
          temp.content = content
        }
      },
      prepare({title, content}) {
        return {
          payload: {
            id: nanoid(),
            title,
            content
          }
        }
      }
    }
  },
  extraReducers(builder) {
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectCount = (state: RootState) => state.counter.value

export const selectAllPosts = (state: RootState) => state.counter.list

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)

export default counterSlice.reducer