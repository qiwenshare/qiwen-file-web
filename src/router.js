import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/file/File.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/Login.vue'),
      meta: {title:'登录 - 奇文社区'},
    },{
      path: '/register',
      name: 'Register',
      component: () => import('./views/Register.vue'),
      meta: {title:'注册 - 奇文社区'},
    }, {
      path: '/file',
      name: 'File',
      component: () => import('./views/file/File.vue'),
      meta: {title:'共享网盘 - 奇文社区'},
    }
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};