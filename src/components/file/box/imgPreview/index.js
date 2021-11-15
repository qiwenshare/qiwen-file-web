import Vue from 'vue'
// 导入组件
import ImgPreview from './BoxMask.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const ImgPreviewConstructor = Vue.extend(ImgPreview)

let imgPreviewInstance = null
/**
 * 初始化图片预览实例
 * @param {string} imgList 图片列表
 * @param {object} defaultIndex 当前查看的图片索引
 */
const initInstanceImgPreview = (imgList, defaultIndex) => {
	imgPreviewInstance = new ImgPreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				imgList,
				defaultIndex
			}
		}
	})
}
/**
 * 图片预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showImgPreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (imgPreviewInstance !== null) {
		document.body.removeChild(imgPreviewInstance.$el)
	}
	let { imgList, defaultIndex } = obj
	return new Promise((reslove) => {
		initInstanceImgPreview(imgList, defaultIndex)
		imgPreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && imgPreviewInstance !== null) {
				document.body.removeChild(imgPreviewInstance.$el)
				imgPreviewInstance = null
			}
		}
		document.body.appendChild(imgPreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			imgPreviewInstance.visible = true //  打开图片预览遮罩层
		})
	})
}

export default showImgPreviewBox
