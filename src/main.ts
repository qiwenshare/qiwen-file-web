import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index' //  引入路由
import '_a/styles/base.scss'
import '_a/fonts/iconfont/iconfont.css'
import * as ElementPlus from '@/plugins/element-plus' //  引入 element-plus 组件
import { createPinia } from 'pinia'

function isValidKey(
	key: string | number | symbol,
	object: object
): key is keyof typeof object {
	return key in object
}

const app = createApp(App)

for (const key in ElementPlus) {
	if (Object.hasOwnProperty.call(ElementPlus, key)) {
		if (isValidKey(key, ElementPlus)) {
			app.use(ElementPlus[key])
		}
	}
}

app.use(router).use(createPinia())
app.mount('#app')
