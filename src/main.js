import Vue from 'vue'
import http from './plugins/axios' //引入axios封装
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/styles/css/base.css'
import './assets/styles/css/border.css'
import '@/assets/styles/css/element-cover.css'
import './assets/styles/iconfont/iconfont.css'
import store from './store'
import globalFunction from './globalFunction'


Vue.config.productionTip = false;
Vue.prototype.$http = http; //把Http挂载到vue实例上
Vue.use(globalFunction);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// 需要登录的路由在此统一处理（全局前置守卫）
router.beforeEach((to, from, next) => {
  
  // 所有页面在加载时均检查用户登录状态
  http.checkUserLoginInfo().then(function (res) {
    store.commit('changeLogin', res.data.success);
    if(res.data.success == true) {
      store.commit('changeUsername',res.data.data.username);
      store.commit('changeUserId', res.data.data.userId);
    }
  })

  if (to.matched.some(m => m.meta.requireAuth)) {
    if (store.state.isLogin !== true) { // 没有登录      
      next({ 
        path: '/login', 
        query: { Rurl: to.fullPath } 
      }) //将to参数中的url传递给login页面进行操作    
    }
  }
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  } 
  /* 路由发生变化修改页面meta */
  if(to.meta.content){
    // debugger
    let head = document.getElementsByTagName('head');
    let meta = document.createElement('meta');
    //meta.setAttribute("name", "description"),
    //document.querySelector('meta[name="keywords"]').setAttribute('content', to.meta.content.keywords)
    document.querySelector('meta[name="description"]').setAttribute('content', to.meta.content.description)
    meta.content = to.meta.content;
    head[0].appendChild(meta)
  }

  next()   // 正常跳转到你设置好的页面 
})
