import { defineStore } from 'pinia'
import { checkUserLoginInfo } from '_r/user' //引入axios封装

// 用户相关
export const userStore = defineStore('userStore', {
	state: () => {
		return {
			isLogin: false, //  用户登录状态
			// 用户信息
			userInfoObj: {
				username: '',
				userId: -1
			}
		}
	},
	getters: {
		// 用户姓名
		username: (state) => state.userInfoObj.username,
		// 用户ID
		userId: (state) => state.userInfoObj.userId
	},
	actions: {
		/**
		 * 获取用户信息
		 */
		getUserInfo() {
			return checkUserLoginInfo().then((res) => {
				if (res.success) {
					// 改变登录状态
					this.isLogin = res.success
					this.userInfoObj = res.data
				} else {
					this.isLogin = res.success
				}
			})
		}
	}
})
