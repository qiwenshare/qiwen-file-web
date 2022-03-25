import Vue from 'vue'
// 导入组件
import UploadFile from './Box.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const UploadFileConstructor = Vue.extend(UploadFile)

let uploadFileInstance = null
/**
 * 初始化右键菜单实例
 * @param {string} params 上传文件组件参数
 * @param {object} uploadWay 上传方式 0-文件上传 1-文件夹上传 2-粘贴图片或拖拽上传
 * @param {} serviceEl 组件实例
 * @param {} callType 是否组件本身
 */
const initInstanceUploadFile = (params, uploadWay, serviceEl, callType) => {
	uploadFileInstance = new UploadFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				params,
				uploadWay,
				serviceEl,
				callType
			}
		}
	})
}
/**
 * 右键菜单 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showUploadFileBox = (obj) => {
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (uploadFileInstance !== null) {
		let { params, uploadWay, serviceEl, callType } = obj
		uploadFileInstance.params = params
		uploadFileInstance.uploadWay = uploadWay
		uploadFileInstance.serviceEl = serviceEl
		uploadFileInstance.callType = callType
		uploadFileInstance.handlePrepareUpload() //  上传组件开始预处理
	} else {
		let { params, uploadWay, serviceEl, callType } = obj
		return new Promise((reslove) => {
			initInstanceUploadFile(params, uploadWay, serviceEl, callType)
			uploadFileInstance.callback = (res) => {
				reslove(res)
				// 服务取消时卸载 DOM
				if (res === 'cancel' && uploadFileInstance !== null) {
					document.body.removeChild(uploadFileInstance.$el)
					uploadFileInstance = null
				}
			}
			document.body.appendChild(uploadFileInstance.$el) //  挂载 DOM
			Vue.nextTick(() => {
				uploadFileInstance.handlePrepareUpload() //  上传组件开始预处理
			})
		})
	}
}

export default showUploadFileBox
