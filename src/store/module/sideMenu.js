export default {
  state: {
    isFolder: sessionStorage.getItem("isFolder"), //  左侧栏是否折叠，0不折叠，1折叠
  },
  mutations: {
    changeIsFolder(state, data) {
      sessionStorage.setItem("isFolder", data);
      state.isFolder = data;
    }
  },
  actions: {
  }
}
