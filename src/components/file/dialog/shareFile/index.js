import Vue from 'vue'
// 导入组件
import ShareFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const ShareFileConstructor = Vue.extend(ShareFileDialog)

let shareFileInstance = null
/**
 * 初始化分享文件实例
 * @param {array} fileInfo 要分享的文件数组
 */
const initInstanceShareFile = (fileInfo) => {
	shareFileInstance = new ShareFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo
			}
		}
	})
}
/**
 * 分享文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showShareFileDialog = (obj) => {
	let { fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceShareFile(fileInfo)
		shareFileInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(shareFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			shareFileInstance.visible = true //  打开对话框
		})
	})
}

export default showShareFileDialog
