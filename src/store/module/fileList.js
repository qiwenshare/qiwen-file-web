export default {
  state: {
    operaColumnExpand: sessionStorage.getItem("operaColumnExpand"), //  操作列是否展开，0不展开，1展开
    selectedColumnList: sessionStorage.getItem("selectedColumnList"), //  列显隐
    imageModel: sessionStorage.getItem("imageModel"), //  图片类型页面是否展示为网格模式，0不是，1是
  },
  mutations: {
    changeOperaColumnExpand(state, data) {
      sessionStorage.setItem("operaColumnExpand", data);
      state.operaColumnExpand = data;
    },
    changeSelectedColumnList(state, data) {
      sessionStorage.setItem("selectedColumnList", data.toString());
      state.selectedColumnList = data.toString();
    },
    changeImageModel(state, data) {
      sessionStorage.setItem("imageModel", data);
      state.imageModel = data;
    },
  },
  actions: {
  }
}
