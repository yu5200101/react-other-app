
import {stores, persistor} from '@/stores'
import { Provider } from 'react-redux'
import {
  RouterProvider
} from 'react-router'
import router from '@/router'
import { PersistGate } from 'redux-persist/integration/react'
import { Watermark } from 'antd'
import dayjs from '@/utils/dayjs'

const App: React.FC = () => {
  const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return (
    <Watermark content={time}>
      <Provider store={stores}>
        <PersistGate loading={<div className="loading">加载持久化状态...</div>} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </Watermark>
  )
}
export default App