import { getstorage } from '@/request/file.js'

export default {
  state: {
    storageValue: 0 //  已使用存储容量
  },
  mutations: {
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
          this.$message.error(res.message)
        }
      });
    }
  }
}
