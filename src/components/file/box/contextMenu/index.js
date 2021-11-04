import Vue from 'vue'
// 导入组件
import ContextMenu from './Box.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const ContextMenuConstructor = Vue.extend(ContextMenu)

let contextMenuInstance = null
/**
 * 初始化右键菜单实例
 * @param {string} selectedFile 文件信息
 * @param {object} domEvent 当前右键点击的元素
 */
const initInstanceContextMenu = (selectedFile, domEvent) => {
	contextMenuInstance = new ContextMenuConstructor({
		el: document.createElement('div'),
		data() {
			return {
				selectedFile,
				domEvent
			}
		}
	})
}
/**
 * 右键菜单 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showContextMenuBox = (obj) => {
	let { selectedFile, domEvent } = obj
	return new Promise((reslove) => {
		initInstanceContextMenu(selectedFile, domEvent)
		contextMenuInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(contextMenuInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			contextMenuInstance.handleOpenContextMenu() //  开始计算右键菜单需要显示的位置
		})
	})
}

export default showContextMenuBox
