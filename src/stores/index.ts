import { configureStore, combineReducers } from '@reduxjs/toolkit'
import auth from './authSlice'
import { apiSlice } from '@/api/apiSlice'
import storage from 'redux-persist/lib/storage/session'; // sessionStorage作为存储引擎
import { persistStore, persistReducer } from 'redux-persist';

const rootReducer = combineReducers({
    auth,
    [apiSlice.reducerPath]: apiSlice.reducer
  });

// 配置持久化
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter'] // 只持久化counter状态
};

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const stores = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware)
})

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof stores.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof stores.dispatch

export const persistor = persistStore(stores)