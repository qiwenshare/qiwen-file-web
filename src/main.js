import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from '@/store/index.js'
import globalFunction from '@/libs/globalFunction.js'
import * as filters from '@/filters/index.js'
import '_a/styles/css/base.css'
import '_a/styles/css/element-cover.css'
import '_a/styles/iconfont/iconfont.css'
import '_a/styles/elementCover.styl'
import '_a/styles/mediaScreenXs.styl'
import '@/router/before.js'
import 'element-ui/lib/theme-chalk/index.css'
import element from './plugins/element.js'
import config from '@/config/index.js'
/**
 * vue-simple-uploader 中文官方文档 https://github.com/simple-uploader/vue-uploader/blob/master/README_zh-CN.md
 * simple-uploader.js 中文官方文档 https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md
 */
import uploader from 'vue-simple-uploader'
// 引入挂载新建文件夹、新建文件、移动文件等插件
import operateElement from '@/plugins/fileOperationPlugins.js'
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.config.productionTip = false

for (let key in globalFunction) {
	Vue.prototype[key] = globalFunction[key]
}

Vue.use(element)
Vue.prototype.$config = config
Vue.use(uploader)
Vue.use(operateElement) //  挂载自定义插件

Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key])
})

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app')
