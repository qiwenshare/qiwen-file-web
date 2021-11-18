import Vue from 'vue'
// 导入组件
import AudioPreview from './Box.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const AudioPreviewConstructor = Vue.extend(AudioPreview)

let audioPreviewInstance = null
/**
 * 初始化音频预览实例
 * @param {string} audioObj 音频对象
 */
const initInstanceAudioPreview = (audioObj) => {
	audioPreviewInstance = new AudioPreviewConstructor({
		el: document.createElement('div'),
		data() {
			return {
				audioObj
			}
		}
	})
}
/**
 * 音频预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showAudioPreviewBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (audioPreviewInstance !== null) {
		document.body.removeChild(audioPreviewInstance.$el)
	}
	let { audioObj } = obj
	return new Promise((reslove) => {
		initInstanceAudioPreview(audioObj)
		audioPreviewInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && audioPreviewInstance !== null) {
				document.body.removeChild(audioPreviewInstance.$el)
				audioPreviewInstance = null
			}
		}
		document.body.appendChild(audioPreviewInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			audioPreviewInstance.visible = true //  打开音频预览遮罩层
		})
	})
}

export default showAudioPreviewBox
