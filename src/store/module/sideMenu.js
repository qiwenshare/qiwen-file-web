import { getstorage } from '@/request/file.js'

export default {
  state: {
    isFolder: sessionStorage.getItem("isFolder"), //  左侧栏是否折叠，0不折叠，1折叠
    storageValue: 0, //  已使用存储容量
    storageMaxValue: Math.pow(1024, 3) * 100 //  最大存储容量，100GB
  },
  mutations: {
    changeIsFolder(state, data) {
      sessionStorage.setItem("isFolder", data);
      state.isFolder = data;
    },
    setStorageValue(state, data) {
      state.storageValue = data;
    }
  },
  actions: {
    showStorage(context) {
      return getstorage().then(res => {
        if (res.success) {
          context.commit('setStorageValue', res.data ? Number(res.data.storageSize) : 0)
        } else {
          this.$message.error(res.errorMessage)
        }
      });
    }
  }
}
