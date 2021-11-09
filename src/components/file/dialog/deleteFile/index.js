import Vue from 'vue'
// 导入组件
import DeleteFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const DeleteFileConstructor = Vue.extend(DeleteFileDialog)

let deleteFileInstance = null
/**
 * 初始化删除文件实例
 * @param {boolean} isBatchOperation 是否为批量删除：true - 批量删除，false - 单文件删除
 * @param {object | array} fileInfo 文件信息，批量时为数组、单文件时为对象
 * @param {number} deleteMode 删除模式：1-删除到回收站 2-彻底删除
 */
const initInstanceDeleteFile = (isBatchOperation, fileInfo, deleteMode) => {
	deleteFileInstance = new DeleteFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				isBatchOperation,
				fileInfo,
				deleteMode
			}
		}
	})
}
/**
 * 删除文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showDeleteFileDialog = (obj) => {
	let { isBatchOperation, fileInfo, deleteMode } = obj
	return new Promise((reslove) => {
		initInstanceDeleteFile(isBatchOperation, fileInfo, deleteMode)
		deleteFileInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(deleteFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			deleteFileInstance.visible = true //  打开对话框
		})
	})
}

export default showDeleteFileDialog
