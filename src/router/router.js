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
			component: () => import(/* webpackChunkName: "home" */ '_v/Home.vue'),
			meta: {
				title: '首页',
				content: {
					description:
						'基于 Spring Boot + Vue CLI@3(Vue 2.0) 框架开发的 Web 文件系统，旨在为用户提供一个简单、方便的文件存储方案'
				}
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import(/* webpackChunkName: "login" */ '_v/Login.vue'),
			meta: { title: '登录' }
		},
		{
			path: '/register',
			name: 'Register',
			component: () =>
				import(/* webpackChunkName: "register" */ '_v/Register.vue'),
			meta: { title: '注册' }
		},
		{
			path: '/file',
			name: 'File',
			component: () => import(/* webpackChunkName: "file" */ '_v/File.vue'),
			meta: {
				requireAuth: true, //  当前路由是否需要登录才可进入
				title: '网盘',
				content: {
					description: '图片 文档 视频 音乐 其他 回收站 我的分享'
				}
			}
		},
		{
			path: '/onlyoffice',
			name: 'Onlyoffice',
			meta: {
				title: '在线编辑预览',
				content: {
					description: 'onlyoffice 文档在线编辑预览，支持 Word Excel PowerPoint'
				}
			},
			component: () =>
				import(/* webpackChunkName: "onlyOffice" */ '_v/OnlyOffice.vue')
		},
		{
			path: '/share/:shareBatchNum',
			name: 'Share',
			component: () => import(/* webpackChunkName: "share" */ '_v/Share.vue'),
			meta: {
				title: '分享',
				content: {
					description: '查看他人分享'
				}
			},
			props: true
		},
		{
			path: '*',
			name: 'Error_404',
			component: () =>
				import(/* webpackChunkName: "error_404" */ '_v/ErrorPage/404.vue'),
			meta: { title: '链接不存在' }
		}
	]
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err)
}
