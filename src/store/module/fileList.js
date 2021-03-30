import globalFunction from '@/globalFunction.js'

export default {
  state: {
    // 表格中显示的列
    selectedColumnList: globalFunction.getCookies('selectedColumnList'),
    // 文件展示模式 0 列表模式 | 1 网格模式 | 2 时间线模式
    fileModel: globalFunction.getCookies('fileModel')
  },
  mutations: {
    /**
     * 改变表格显示列
     * @description 表格显示列保存在 Vuex 和 cookie 中
     * @param {object} state Vuex 的 state 对象
     * @param {[]} data 表格需要显示的列数组
     */
    changeSelectedColumnList(state, data) {
      globalFunction.setCookies('selectedColumnList', data.toString())
      state.selectedColumnList = data.toString();
    },
    /**
     * 改变文件展示模式
     * @description 文件展示模式保存在 Vuex 和 cookie 中
     * @param {object} state Vuex 的 state 对象 
     * @param {string} data 文件展示模式
     */
    changeFileModel(state, data) {
      globalFunction.setCookies('fileModel', data)
      state.fileModel = data;
    }
  },
  actions: {
  }
}
