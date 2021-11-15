import Vue from 'vue'
// 导入组件
import UnzipFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const UnzipFileConstructor = Vue.extend(UnzipFileDialog)

let unzipFileInstance = null
/**
 * 初始化解压缩文件实例
 * @param {string} unzipMode 解压模式 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 2-手动选择解压目录
 * @param {string} userFileId 文件用户 ID
 */
const initInstanceUnzipFile = (unzipMode, userFileId) => {
	unzipFileInstance = new UnzipFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				unzipMode,
				userFileId
			}
		}
	})
}
/**
 * 解压缩文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showUnzipFileDialog = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (unzipFileInstance !== null) {
		document.body.removeChild(unzipFileInstance.$el)
	}
	let { unzipMode, userFileId } = obj
	return new Promise((reslove) => {
		initInstanceUnzipFile(unzipMode, userFileId)
		unzipFileInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && unzipFileInstance !== null) {
				document.body.removeChild(unzipFileInstance.$el)
				unzipFileInstance = null
			}
		}
		document.body.appendChild(unzipFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			unzipFileInstance.visible = true //  打开对话框
		})
	})
}

export default showUnzipFileDialog
