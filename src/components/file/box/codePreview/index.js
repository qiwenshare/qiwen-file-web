import Vue from 'vue'
// 导入组件
import CodePreview from './BoxMask.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const CodePreviewConstructor = Vue.extend(CodePreview)

let codePreviewInstance = null
/**
 * 初始化代码预览实例
 * @param {string} fileInfo 文件信息
 * @param {boolean} isEdit 是否可编辑
 */
const initInstanceCodePreview = (fileInfo, isEdit) => {
	codePreviewInstance = new CodePreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo,
				isEdit
			}
		}
	})
}
/**
 * 代码预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showCodePreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (codePreviewInstance !== null) {
		document.body.removeChild(codePreviewInstance.$el)
	}
	let { fileInfo, isEdit } = obj
	return new Promise((reslove) => {
		initInstanceCodePreview(fileInfo, isEdit)
		codePreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && codePreviewInstance !== null) {
				document.body.removeChild(codePreviewInstance.$el)
				codePreviewInstance = null
			}
		}
		document.body.appendChild(codePreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			codePreviewInstance.visible = true //  打开代码预览遮罩层
		})
	})
}

export default showCodePreviewBox
