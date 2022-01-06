import { getStorage } from '_r/file.js'

export default {
	state: {
		storageValue: 0, //  文件已占用的存储空间大小
		totalStorageValue: 0
	},
	mutations: {
		/**
		 * 保存文件已占用的存储空间大小
		 * @param {object} state Vuex 的 state 对象
		 * @param {number} data 存储大小
		 */
		setStorageValue(state, data) {
			state.storageValue = data
		},
		setTotalStorageValue(state, data) {
			state.totalStorageValue = data
		}
	},
	actions: {
		/**
		 * 获取文件已占用的存储空间
		 */
		showStorage(context) {
			return getStorage().then((res) => {
				if (res.success) {
					context.commit(
						'setStorageValue',
						res.data
							? res.data.storageSize === null
								? 0
								: Number(res.data.storageSize)
							: 0
					)
					context.commit(
						'setTotalStorageValue',
						res.data
							? res.data.totalStorageSize === null
								? 0
								: Number(res.data.totalStorageSize)
							: 0
					)
				} else {
					this.$message.error(res.message)
				}
			})
		}
	}
}
