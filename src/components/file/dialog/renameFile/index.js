import Vue from 'vue'
// 导入组件
import RenameFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const RenameFileConstructor = Vue.extend(RenameFileDialog)

let renameFileInstance = null
/**
 * 初始化重命名文件实例
 * @param {string} oldFileName 文件原本的名称
 * @param {string} userFileId 文件 ID
 */
const initInstanceRenameFile = (oldFileName, userFileId) => {
	renameFileInstance = new RenameFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				oldFileName,
				userFileId
			}
		}
	})
}
/**
 * 重命名文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showRenameFileDialog = (obj) => {
	let { oldFileName, userFileId } = obj
	return new Promise((reslove) => {
		initInstanceRenameFile(oldFileName, userFileId)
		renameFileInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(renameFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			renameFileInstance.visible = true //  打开对话框
		})
	})
}

export default showRenameFileDialog
