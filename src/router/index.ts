import { createBrowserRouter } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import homeLayout from '@/pages/home/homeLayout'
import home from '@/pages/home'
import NullLayout from '@/components/NullLayout'
import course from '@/pages/home/course'
import teaching from '@/pages/home/course/teaching'
import trial from '@/pages/home/course/trial'
import login from '@/pages/login'
import NotFound from '@/pages/NotFound'
import storage from '@/utils/storage'
import { locationReplace } from '@/utils/navigate'

const router = createBrowserRouter([
  {
    path: '/',
    // loader可以做路由守卫的功能
    loader: () => {
      const token = storage.localStorage.getItem('token')
      if (token) return
      locationReplace('/login')
    },
    Component: homeLayout,
    children: [{
      index: true,
      loader: loader,
      Component: home
    }, {
      path: 'home',
      loader: loader,
      Component: NullLayout,
      children: [{
        index: true,
        loader: loader,
        Component: home,
      },{
        path: ':id',
        loader: loader,
        Component: NullLayout,
        children: [{
          index: true,
          loader: loader,
          Component: course,
        }, {
          path: 'teaching',
          loader: loader,
          Component: teaching
        }, {
          path: 'trial',
          loader: loader,
          Component: trial
        }]
      }]
    }]
  }, {
    path: 'login',
    loader: loader,
    Component: login
  }, {
    path: '*',
    loader: loader,
    Component: NotFound
  }
])

async function loader({ params } : LoaderFunctionArgs) {
  return {
    params
  }
}

export default router