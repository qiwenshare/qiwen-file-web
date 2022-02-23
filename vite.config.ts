import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), ElementPlus({})],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			_v: path.resolve(__dirname, './src/views'),
			_c: path.resolve(__dirname, './src/components'),
			_a: path.resolve(__dirname, './src/assets'),
			_r: path.resolve(__dirname, './src/request'),
			_public: path.resolve(__dirname, './public')
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://www.qiwenshare.com:8763/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	}
})
