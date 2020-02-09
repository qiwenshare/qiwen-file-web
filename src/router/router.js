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
        title:'奇文社区 - 高质量的IT技术分享社区',
        content:{
          description:'奇文社区是一个优秀的IT技术分享社区，注重内容的高质量和原创，在这里每个人都可以进行分享。快来加入我们，期待与您共建更优质的社区环境...'
        }
      },
    },{
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {title:'登录 - 奇文社区'},
    },{
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: {title:'注册 - 奇文社区'},
    },{
      path: '/file',
      name: 'File',
      component: () => import('@/views/file/File.vue'),
      meta: {title:'共享网盘 - 奇文社区'},
    }, {
      path: '/500',
      name: 'Error_500',
      component: () => import('@/views/ErrorPage/500.vue'),
      meta: {title:'500 - 奇文社区'},
    }, {
      path: '/401',
      name: 'Error_401',
      component: () => import('@/views/ErrorPage/401.vue'),
      meta: {title:'401 - 奇文社区'},
    },{
      path: '*',
      name: 'Error_404',
      component: () => import('@/views/ErrorPage/404.vue'),
      meta: {title:'404 - 奇文社区'},
    }
  ]
})


const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};