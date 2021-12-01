import Vue from 'vue'
// 导入组件
import CopyFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const CopyFileConstructor = Vue.extend(CopyFileDialog)

let copyFileInstance = null
/**
 * 初始化复制文件实例
 * @param {object | array} fileInfo 要复制的文件信息
 */
const initInstanceCopyFile = (fileInfo) => {
	copyFileInstance = new CopyFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo
			}
		}
	})
}
/**
 * 复制文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showCopyFileDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (copyFileInstance !== null) {
		document.body.removeChild(copyFileInstance.$el)
	}
	let { fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceCopyFile(fileInfo)
		copyFileInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && copyFileInstance !== null) {
				document.body.removeChild(copyFileInstance.$el)
				copyFileInstance = null
			}
		}
		document.body.appendChild(copyFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			copyFileInstance.visible = true //  打开对话框
		})
	})
}

export default showCopyFileDialog
