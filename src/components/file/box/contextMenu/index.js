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
	// 非首次调用服务时，在 DOM 中移除上个实例
	if (contextMenuInstance !== null) {
		document.body.removeChild(contextMenuInstance.$el)
	}
	let { selectedFile, domEvent } = obj
	return new Promise((reslove) => {
		initInstanceContextMenu(selectedFile, domEvent)
		contextMenuInstance.callback = (res) => {
			reslove(res)
			// 服务取消时卸载 DOM
			if (res === 'cancel' && contextMenuInstance !== null) {
				document.body.removeChild(contextMenuInstance.$el)
				contextMenuInstance = null
			}
		}
		document.body.appendChild(contextMenuInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			contextMenuInstance.handleOpenContextMenu() //  开始计算右键菜单需要显示的位置
		})
	})
}

// 添加关闭事件
showContextMenuBox.close = () => {
	if (contextMenuInstance !== null) {
		document.body.removeChild(contextMenuInstance.$el)
		contextMenuInstance = null
	}
}

export default showContextMenuBox
