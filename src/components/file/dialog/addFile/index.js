import Vue from 'vue'
import router from '@/router/router.js'
// 导入组件
import AddFileDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const AddFileConstructor = Vue.extend(AddFileDialog)

let addFileInstance = null
/**
 * 初始化新建文件实例
 * @param {string} extendName office 文件扩展名
 * @param {string} filePath 新建文件夹的父路径
 */
const initInstanceAddFile = (
	extendName,
	filePath = router.currentRoute.query.filePath || '/'
) => {
	addFileInstance = new AddFileConstructor({
		el: document.createElement('div'),
		data() {
			return {
				extendName,
				filePath
			}
		}
	})
}
/**
 * 新建文件 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showAddFileDialog = (obj) => {
	let { extendName, filePath } = obj
	return new Promise((reslove) => {
		initInstanceAddFile(extendName, filePath)
		addFileInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(addFileInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			addFileInstance.visible = true //  打开对话框
		})
	})
}

export default showAddFileDialog
