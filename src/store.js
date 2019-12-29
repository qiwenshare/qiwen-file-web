import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,    //初始时候给一个 isLogin = false 表示用户未登录
    username: '',
    userId: 0,
    userImgUrl: ''
  },
  mutations: {
    changeLogin(state, data) { // 改变state中的状态值
      state.isLogin = data;
    },
    changeUsername(state,data) {
      state.username = data;
    },
    changeUserId(state, data) {
      state.userId = data;
    },
    changeUserImgUrl(state, data) {
      state.userImgUrl = '/api' + data
    }
  },
  actions: {

  }
})

// const mutations = {
//   changeLogin(state, data) {
//     state.isLogin = data;
//   }
// };


