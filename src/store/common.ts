import { defineStore } from 'pinia'

export const commonStore = defineStore('commonStore', {
	state: () => {
		return {
			screenWidth: document.body.clientWidth //  屏幕宽度
		}
	},
	actions: {
		/**
		 * 改变屏幕宽度
		 * @param {number} data 屏幕宽度
		 */
		changeScreenWidth(data: number) {
			this.screenWidth = data
		}
	}
})
