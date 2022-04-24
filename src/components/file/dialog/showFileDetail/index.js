import Vue from 'vue'
// 导入组件
import FileDetailDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const FileDetailConstructor = Vue.extend(FileDetailDialog)

let fileDetailInstance = null
/**
 * 初始化文件详情文件实例
 * @param {object | array} fileInfo 文件信息，批量时为数组、单文件时为对象
 */
const initInstanceFileDetail = (fileInfo) => {
	fileDetailInstance = new FileDetailConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo
			}
		}
	})
}
/**
 * 文件详情文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showFileDetailDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (fileDetailInstance !== null) {
		document.body.removeChild(fileDetailInstance.$el)
	}
	let { fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceFileDetail(fileInfo)
		fileDetailInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && fileDetailInstance !== null) {
				document.body.removeChild(fileDetailInstance.$el)
				fileDetailInstance = null
			}
		}
		document.body.appendChild(fileDetailInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			fileDetailInstance.visible = true //  打开对话框
		})
	})
}

export default showFileDetailDialog
