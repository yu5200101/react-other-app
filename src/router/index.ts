import { createBrowserRouter } from 'react-router'
import type { LoaderFunctionArgs } from 'react-router'
import homeLayout from '@/pages/home/homeLayout'
import home from '@/pages/home'
import NullLayout from '@/components/NullLayout'
import course from '@/pages/home/course'
import teaching from '@/pages/home/course/teaching'
import trial from '@/pages/home/course/trial'
import login from '@/pages/login'
import process from '@/pages/process'
import NotFound from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
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
    path: 'process',
    loader: loader,
    Component: process
  }, {
    path: '*',
    loader: loader,
    Component: NotFound
  }
], {
  basename: '/react-other-app'
})

async function loader({ params } : LoaderFunctionArgs) {
  return {
    params
  }
}

export default router