import Vue from 'vue'
// 导入组件
import FileDetailInfoDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const FileDetailInfoConstructor = Vue.extend(FileDetailInfoDialog)

let fileDetailInfoInstance = null
/**
 * 初始化文件详情文件实例
 * @param {object | array} fileInfo 文件信息，批量时为数组、单文件时为对象
 */
const initInstanceFileDetailInfo = (fileInfo) => {
	fileDetailInfoInstance = new FileDetailInfoConstructor({
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
const showFileDetailInfoDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (fileDetailInfoInstance !== null) {
		document.body.removeChild(fileDetailInfoInstance.$el)
	}
	let { fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceFileDetailInfo(fileInfo)
		fileDetailInfoInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && fileDetailInfoInstance !== null) {
				document.body.removeChild(fileDetailInfoInstance.$el)
				fileDetailInfoInstance = null
			}
		}
		document.body.appendChild(fileDetailInfoInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			fileDetailInfoInstance.visible = true //  打开对话框
		})
	})
}

export default showFileDetailInfoDialog
