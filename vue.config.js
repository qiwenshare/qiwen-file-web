const productConfig = require('./public/config.json')
const path = require('path')

module.exports = {
	// 选项...
	publicPath: '/',

	devServer: {
		disableHostCheck: true,
		host: '0.0.0.0',
		proxy: {
			//配置代理，解决跨域请求后台数据的问题
			'/api': {
				target: productConfig.baseUrl, //后台接口，连接本地服务
				ws: true, //是否跨域
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/'
				}
			}
		}
	},

	productionSourceMap: false,

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'stylus',
			patterns: []
		}
	},

	configureWebpack: (config) => {
		config.resolve.alias = {
			'@': path.resolve(__dirname, './src'),
			_v: path.resolve(__dirname, './src/views'),
			_c: path.resolve(__dirname, './src/components'),
			_a: path.resolve(__dirname, './src/assets'),
			_r: path.resolve(__dirname, './src/request')
		}
	}
}
