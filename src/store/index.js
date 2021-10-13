import Vue from 'vue'
import Vuex from 'vuex'

import config from '@/config'

import user from './module/user' //  用户模块
import fileList from './module/fileList' //  文件列表模块
import sideMenu from './module/sideMenu' //  左侧菜单模块
import imgPreview from './module/imgPreview' //  图片预览模块
import videoPreview from './module/videoPreview' //  视频预览模块

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
			state.fileList.selectedColumnList === undefined
				? config.allColumnList
				: state.fileList.selectedColumnList.split(','),
		// 文件查看模式
		fileModel: (state) =>
			state.fileList.fileModel === undefined
				? 0
				: Number(state.fileList.fileModel),
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
		imgPreview,
		videoPreview
	}
})
