import Vue from 'vue'
// 导入组件
import SaveShareFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const SaveShareFileConstructor = Vue.extend(SaveShareFileDialog)

let saveShareFileInstance = null
/**
 * 初始化保存分享文件实例
 * @param {array} fileInfo 要保存的文件数组
 */
const initInstanceSaveShareFile = (fileInfo) => {
	saveShareFileInstance = new SaveShareFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo
			}
		}
	})
}
/**
 * 保存分享文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showSaveShareFileDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (saveShareFileInstance !== null) {
		document.body.removeChild(saveShareFileInstance.$el)
	}
	let { fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceSaveShareFile(fileInfo)
		saveShareFileInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && saveShareFileInstance !== null) {
				document.body.removeChild(saveShareFileInstance.$el)
				saveShareFileInstance = null
			}
		}
		document.body.appendChild(saveShareFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			saveShareFileInstance.visible = true //  打开对话框
		})
	})
}

export default showSaveShareFileDialog
