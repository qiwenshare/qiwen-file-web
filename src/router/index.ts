import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'Home',
			component: () => import('_v/HomePage.vue'),
			meta: {
				title:
					'开源网盘 | 多种存储方式 | 在线预览编辑 | 分片、断点续传 | 文件分享',
				content: {
					description:
						'基于 Spring Boot + Vue 3.0 框架开发的 Web 文件系统，旨在为用户提供一个简单、方便的文件存储方案'
				}
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('_v/LoginPage.vue'),
			meta: { title: '登录' }
		},
		{
			path: '/register',
			name: 'Register',
			component: () => import('_v/RegisterPage.vue'),
			meta: { title: '注册' }
		},
		{
			path: '/file',
			name: 'File',
			component: () => import('_v/FilePage.vue'),
			meta: {
				requireAuth: true, //  当前路由是否需要登录才可进入
				title: '网盘',
				content: {
					description: '图片 文档 视频 音乐 其他 回收站 我的分享'
				}
			}
		},
		// {
		// 	path: '/onlyoffice',
		// 	name: 'Onlyoffice',
		// 	meta: {
		// 		title: '在线编辑预览',
		// 		content: {
		// 			description: 'onlyoffice 文档在线编辑预览，支持 Word Excel PowerPoint'
		// 		}
		// 	},
		// 	component: () => import('_v/OnlyOffice.vue')
		// },
		// {
		// 	path: '/share/:shareBatchNum',
		// 	name: 'Share',
		// 	component: () => import('_v/Share.vue'),
		// 	meta: {
		// 		title: '分享',
		// 		content: {
		// 			description: '查看他人分享'
		// 		}
		// 	},
		// 	props: true
		// },
		{
			path: '/notice',
			name: 'Notice',
			component: () => import('_v/notice/NoticeList.vue'),
			meta: {
				title: '公告',
				content: {
					description: '公告列表'
				}
			}
		},
		{
			path: '/notice/:noticeId',
			name: 'NoticeDetail',
			component: () => import('_v/notice/NoticeDetail.vue'),
			meta: {
				title: '公告详情',
				content: {
					description: '公告详情'
				}
			}
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'Error_404',
			component: () => import('_v/errorPage/NotFound.vue'),
			meta: { title: '链接不存在' }
		}
	]
})

export default router
