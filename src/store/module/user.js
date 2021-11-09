import { checkUserLoginInfo } from '_r/user.js' //引入axios封装

export default {
	state: {
		isLogin: false, //  用户登录状态
		userInfoObj: {} //  用户信息
	},
	mutations: {
		/**
		 * 保存登录状态
		 * @param {object} state Vuex 的 state 对象
		 * @param {boolean} data 登录状态
		 */
		changeIsLogin(state, data) {
			state.isLogin = data
		},
		/**
		 * 保存用户信息
		 * @param {object} state Vuex 的 state 对象
		 * @param {boolean} data 用户信息
		 */
		changeUserInfoObj(state, data) {
			state.userInfoObj = Object.assign({}, state.userInfoObj, data)
		}
	},
	actions: {
		/**
		 * 获取用户信息
		 */
		getUserInfo(context) {
			return checkUserLoginInfo().then((res) => {
				if (res.success) {
					// 改变登录状态
					context.commit('changeIsLogin', res.success)
					// 保存用户信息
					context.commit('changeUserInfoObj', res.data)
				} else {
					context.commit('changeIsLogin', res.success)
				}
			})
		}
	}
}
