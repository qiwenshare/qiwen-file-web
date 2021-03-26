import globalFunction from '@/globalFunction.js'

export default {
  state: {
    selectedColumnList: globalFunction.getCookies('selectedColumnList'), //  列显隐
    fileModel: globalFunction.getCookies('fileModel'), //  文件展示模式，0列表模式，1网格模式 2时间线模式
  },
  mutations: {
    changeSelectedColumnList(state, data) {
      globalFunction.setCookies('selectedColumnList', data.toString())
      state.selectedColumnList = data.toString();
    },
    changeFileModel(state, data) {
      globalFunction.setCookies('fileModel', data)
      state.fileModel = data;
    }
  },
  actions: {
  }
}
