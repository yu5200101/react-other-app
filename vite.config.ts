import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['chrome < 50', 'edge < 15'],
    }),
    checker({
      typescript: true, // 启用 TypeScript 检查
      // eslint: { // 可选：同时启用 ESLint
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      // },
      overlay: { // 在浏览器中显示错误
        initialIsOpen: false, // 启动时不自动打开
        position: 'tr', // 右上角显示
      }
    })
  ],
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
    target: ['es2015', 'edge12', 'firefox60', 'chrome50', 'safari10'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console 语句
        drop_debugger: true // 移除 debugger
      },
      format: {
        comments: false // 移除所有注释
      }
    }
  }
})
