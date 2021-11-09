import Vue from 'vue'
// 导入组件
import RestoreFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const RestoreFileConstructor = Vue.extend(RestoreFileDialog)

let restoreFileInstance = null
/**
 * 初始化还原文件实例
 * @param {string} deleteBatchNum 删除批次号
 * @param {number} filePath 文件路径
 */
const initInstanceRestoreFile = (deleteBatchNum, filePath) => {
	restoreFileInstance = new RestoreFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				deleteBatchNum,
				filePath
			}
		}
	})
}
/**
 * 还原文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showRestoreFileDialog = (obj) => {
	let { deleteBatchNum, filePath } = obj
	return new Promise((reslove) => {
		initInstanceRestoreFile(deleteBatchNum, filePath)
		restoreFileInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(restoreFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			restoreFileInstance.visible = true //  打开对话框
		})
	})
}

export default showRestoreFileDialog
