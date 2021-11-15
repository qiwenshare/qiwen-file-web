import Vue from 'vue'
// 导入组件
import VideoPreview from './BoxMask.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const VideoPreviewConstructor = Vue.extend(VideoPreview)

let videoPreviewInstance = null
/**
 * 初始化视频预览实例
 * @param {string} videoList 视频列表
 * @param {object} defaultIndex 当前查看的视频索引
 */
const initInstanceVideoPreview = (videoList, defaultIndex) => {
	videoPreviewInstance = new VideoPreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				videoList,
				defaultIndex
			}
		}
	})
}
/**
 * 视频预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showVideoPreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (videoPreviewInstance !== null) {
		document.body.removeChild(videoPreviewInstance.$el)
	}
	let { videoList, defaultIndex } = obj
	return new Promise((reslove) => {
		initInstanceVideoPreview(videoList, defaultIndex)
		videoPreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && videoPreviewInstance !== null) {
				document.body.removeChild(videoPreviewInstance.$el)
				videoPreviewInstance = null
			}
		}
		document.body.appendChild(videoPreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			videoPreviewInstance.visible = true //  打开视频预览遮罩层
		})
	})
}

export default showVideoPreviewBox
