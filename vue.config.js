const path = require('path')

module.exports = {
	// 选项...
	publicPath: '/',

	devServer: {
		disableHostCheck: true,
		host: '0.0.0.0',
		// 配置代理，解决本地开发环境下跨域请求后台接口的问题，proxy 中的修改项修改完后需要重启项目才可生效
		proxy: {
			'/api': {
				target: 'http://localhost:8080', //  本地开发环境 - 连接后台接口
				ws: true, //是否跨域
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/'
				}
			}
		}
	},

	productionSourceMap: false,

	// 修改或新增 html-webpack-plugin 的值，在 index.html 里面能读取 htmlWebpackPlugin.options.title
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].title = '奇文网盘'
			return args
		})
	},

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
