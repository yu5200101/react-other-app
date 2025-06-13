import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-other-app/',
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
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // 精确匹配包名而不是路径
          const packageMap = {
            'react': 'vendor-react',
            'react-dom': 'vendor-react-dom',
            'react-router': 'vendor-react-router',
            '@reduxjs/toolkit': 'vendor-redux',
            'react-redux': 'vendor-redux',
            'lodash': 'vendor-lodash',
            'lodash-es': 'vendor-lodash',
            'axios': 'vendor-axios',
          }
          // 检查是否在 node_modules 中
          if (id.includes('node_modules')) {
            // 优先匹配已知包
            for (const [pkg, chunkName] of Object.entries(packageMap)) {
              if (id.includes(`/node_modules/${pkg}/`)) {
                return chunkName
              }
            }
            
            // 按顶级包名分组其他依赖
            const match = id.match(/node_modules\/([^\/]+)/)
            return match ? `vendor-${match[1]}` : 'vendor-other'
          }
          // 业务代码拆分
          if (id.includes('src/pages')) return 'pages'
          if (id.includes('src/hooks')) return 'hooks'
          if (id.includes('src/stores')) return 'stores'
          if (id.includes('src/utils')) return 'utils'
        },
        // 优化 chunk 命名
        chunkFileNames: 'assets/[name]-[hash].js',
        // 确保入口文件命名
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
