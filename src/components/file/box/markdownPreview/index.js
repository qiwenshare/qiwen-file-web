import Vue from 'vue'
// 导入组件
import MarkdownPreview from './BoxMask.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const MarkdownPreviewConstructor = Vue.extend(MarkdownPreview)

let markdownPreviewInstance = null
/**
 * 初始化 markdown 预览实例
 * @param {string} fileInfo 文件信息
 * @param {boolean} editable 是否可编辑
 */
const initInstanceMarkdownPreview = (fileInfo, editable) => {
	markdownPreviewInstance = new MarkdownPreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				fileInfo,
				editable
			}
		}
	})
}
/**
 *  markdown 预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showMarkdownPreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (markdownPreviewInstance !== null) {
		document.body.removeChild(markdownPreviewInstance.$el)
	}
	let { fileInfo, editable } = obj
	return new Promise((reslove) => {
		initInstanceMarkdownPreview(fileInfo, editable)
		markdownPreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && markdownPreviewInstance !== null) {
				document.body.removeChild(markdownPreviewInstance.$el)
				markdownPreviewInstance = null
			}
		}
		document.body.appendChild(markdownPreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			markdownPreviewInstance.visible = true //  打开 markdown 预览遮罩层
		})
	})
}

export default showMarkdownPreviewBox
