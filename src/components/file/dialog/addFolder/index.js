import Vue from 'vue'
// 导入组件
import AddFolderDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const AddFolderConstructor = Vue.extend(AddFolderDialog)

let addFolderInstance = null
/**
 * 初始化新建文件夹实例
 * @param {string} filePath 新建文件的父路径
 */
const initInstanceAddFolder = (filePath) => {
	addFolderInstance = new AddFolderConstructor({
		el: document.createElement('div'),
		data() {
			return {
				filePath
			}
		}
	})
}
/**
 * 新建文件夹 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showAddFolderDialog = ({ filePath }) => {
	return new Promise((reslove) => {
		initInstanceAddFolder(filePath)
		addFolderInstance.callback = (res) => {
			reslove(res)
		}
		document.body.appendChild(addFolderInstance.$el) //  挂载 DOM
		Vue.nextTick(() => {
			addFolderInstance.visible = true //  打开对话框
		})
	})
}

export default showAddFolderDialog
