import Vue from 'vue'
// 导入组件
import AddFolderDialog from './Dialog.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const AddFolderConstructor = Vue.extend(AddFolderDialog)

let addFolderInstance = null
/**
 * 初始化新建文件夹实例
 */
const initInstanceAddFolder = () => {
  addFolderInstance = new AddFolderConstructor({
    el: document.createElement('div'),
    data() {
      return {}
    }
  })
}
/**
 * 新建文件夹 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showAddFolderDialog = () => {
  // 非首次调用服务时，在 DOM 中移除上个实例
  if (addFolderInstance !== null) {
    document.body.removeChild(addFolderInstance.$el)
  }
  return new Promise(reslove => {
    initInstanceAddFolder()
    addFolderInstance.callback = res => {
      reslove(res)
      // 服务取消时卸载 DOM
      if (res === 'cancel' && addFolderInstance !== null) {
        document.body.removeChild(addFolderInstance.$el)
        addFolderInstance = null
      }
    }
    document.body.appendChild(addFolderInstance.$el) //  挂载 DOM
    Vue.nextTick(() => {
      addFolderInstance.getWeChatAuthStateData()
    })
  })
}

export default showAddFolderDialog
