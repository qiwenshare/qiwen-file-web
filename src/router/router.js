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
      component: () => import('@/views/file/File.vue'),
      meta: {
        requireAuth: true, 
        title:'奇文网盘',
        content:{
          description:'基于springboot + vue 框架开发的Web文件系统，旨在为用户提供一个简单、方便的文件存储方案'
        }
      },
    },{
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {title:'登录 - 奇文网盘'},
    },{
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: {title:'注册 - 奇文网盘'},
    },{
      path: '/file',
      name: 'File',
      component: () => import('@/views/file/File.vue'),
      meta: {requireAuth: true, title:'奇文网盘'},
    }, {
      path: '/500',
      name: 'Error_500',
      component: () => import('@/views/ErrorPage/500.vue'),
      meta: {title:'500 - 奇文网盘'},
    }, {
      path: '/401',
      name: 'Error_401',
      component: () => import('@/views/ErrorPage/401.vue'),
      meta: {title:'401 - 奇文网盘'},
    },{
      path: '*',
      name: 'Error_404',
      component: () => import('@/views/ErrorPage/404.vue'),
      meta: {title:'404 - 奇文网盘'},
    }
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};