import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from '@/store'
import all from '@/globalFunction.js'
import '@/assets/styles/css/base.css'
import '@/assets/styles/css/border.css'
import '@/assets/styles/css/element-cover.css'
import '@/assets/styles/css/mediaScreen.styl'
import '@/assets/styles/iconfont/iconfont.css'
import '@/router/before.js'

Vue.config.productionTip = false;
Vue.use(all);

Vue.config.devtools = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')