import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome < 50', 'edge < 15'],
    })],
  server: {
    host: '0.0.0.0',
    // 设置服务启动端口号
    port: 1002,
    // 设置服务启动时是否自动打开浏览器
    open: false,
    // 允许跨域
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {}
  },
  build: {
    target: ['es2015', 'edge12', 'firefox60', 'chrome50', 'safari10']
  }
})
