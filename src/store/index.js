import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user' //  用户模块
import fileList from './module/fileList' //  文件列表模块
import sideMenu from './module/sideMenu' //  左侧菜单模块
import common from './module/common' //  公共模块

import { allColumnList } from '@/libs/map.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		//
	},
	getters: {
		// 登录状态
		isLogin: (state) => state.user.isLogin,
		// 用户姓名
		username: (state) => state.user.userInfoObj.username,
		// 用户ID
		userId: (state) => state.user.userInfoObj.userId,
		// 表格显示列
		selectedColumnList: (state) =>
			state.fileList.selectedColumnList === null
				? allColumnList
				: state.fileList.selectedColumnList.split(','),
		// 文件查看模式
		fileModel: (state) =>
			state.fileList.fileModel === null ? 0 : Number(state.fileList.fileModel),
		// 网格模式 & 时间线模式下 文件图标大小
		gridSize: (state) => state.fileList.gridSize,
		// 剩余存储空间
		remainderStorageValue: (state) =>
			state.sideMenu.totalStorageValue - state.sideMenu.storageValue
	},
	mutations: {
		//
	},
	actions: {
		//
	},
	modules: {
		user,
		fileList,
		sideMenu,
		common
	}
})
