const productConfig = require('./public/config.json')
module.exports = {
  // 选项...
  publicPath: '/',

  //是否开启eslint校验
  lintOnSave: false,

  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    proxy: { //配置代理，解决跨域请求后台数据的问题
      '/api': {
        target: productConfig.baseUrl, //后台接口，连接本地服务
        ws: true, //是否跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api':'/'
        }
      }
      
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: []
    }
  },

  //  模块大小分析工具
  chainWebpack: config => {
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },

  //  打包配置
  configureWebpack: {
    externals: {
      "vue": 'Vue',
      "element-ui": 'Element'
    }
  }
}
