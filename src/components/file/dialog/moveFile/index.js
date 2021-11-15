import Vue from 'vue'
// 导入组件
import MoveFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const MoveFileConstructor = Vue.extend(MoveFileDialog)

let moveFileInstance = null
/**
 * 初始化移动文件实例
 * @param {boolean} isBatchOperation 是否为批量移动：true - 批量移动，false - 单文件移动
 * @param {object | array} fileInfo 文件信息，单文件移动时，为单个文件对象；批量移动时，为文件数组
 */
const initInstanceMoveFile = (isBatchOperation, fileInfo) => {
	moveFileInstance = new MoveFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				isBatchOperation,
				fileInfo
			}
		}
	})
}
/**
 * 移动文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showMoveFileDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (moveFileInstance !== null) {
		document.body.removeChild(moveFileInstance.$el)
	}
	let { isBatchOperation, fileInfo } = obj
	return new Promise((reslove) => {
		initInstanceMoveFile(isBatchOperation, fileInfo)
		moveFileInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && moveFileInstance !== null) {
				document.body.removeChild(moveFileInstance.$el)
				moveFileInstance = null
			}
		}
		document.body.appendChild(moveFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			moveFileInstance.visible = true //  打开对话框
		})
	})
}

export default showMoveFileDialog
