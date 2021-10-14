import router from '@/router/router'
import store from '@/store/index.js'

// 路由全局前置守卫
router.beforeEach((to, from, next) => {
	if (to.matched.some((m) => m.meta.requireAuth)) {
		// 调用获取用户登录状态和信息的接口
		store.dispatch('getUserInfo').then(() => {
			if (!store.getters.isLogin) {
				// 没有登录时，跳转到登录页面
				next({
					path: '/login',
					query: { Rurl: to.fullPath } //  将to参数中的url传递给login页面进行操作
				})
			} else {
				next() // 正常跳转
			}
		})
	} else {
		// 正常跳转
		next()
		// 调用获取用户登录状态和信息的接口，以便显示顶部导航栏的用户登录信息
		store.dispatch('getUserInfo')
	}
	// 路由发生变化修改页面 title
	if (to.meta.title) {
		document.title = to.meta.title
	}
	// 路由发生变化修改页面 meta
	if (to.meta.content) {
		let head = document.getElementsByTagName('head')
		let meta = document.createElement('meta')
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', to.meta.content.description)
		meta.content = to.meta.content
		head[0].appendChild(meta)
	}
})
