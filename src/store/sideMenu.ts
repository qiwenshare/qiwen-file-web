import { defineStore } from 'pinia'
import { getStorage } from '_r/file'

export const sideMenuStore = defineStore('sideMenuStore', {
	state: () => {
		return {
			storageValue: 0, //  文件已占用的存储空间大小
			totalStorageValue: 0
		}
	},
	getters: {
		// 剩余存储空间
		remainderStorageValue: (state) =>
			state.totalStorageValue - state.storageValue
	},
	actions: {
		/**
		 * 获取文件已占用的存储空间
		 */
		showStorage() {
			return getStorage().then((res) => {
				if (res.success) {
					this.storageValue = res.data
						? res.data.storageSize === null
							? 0
							: Number(res.data.storageSize)
						: 0
					this.totalStorageValue = res.data
						? res.data.totalStorageSize === null
							? 0
							: Number(res.data.totalStorageSize)
						: 0
				}
			})
		}
	}
})
