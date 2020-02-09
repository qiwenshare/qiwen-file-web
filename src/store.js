import Vue from 'vue'
import Vuex from 'vuex'
import { checkUserLoginInfo } from '@/request/user.js' //引入axios封装

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,    //初始时候给一个 isLogin = false 表示用户未登录
    username: '',
    userId: 0,
    userImgUrl: '',
    userInfoObj: {},
    notReadDot: false,
    notReadCount: 0
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
      if(data) {
        if(data.includes('http')) { //  若是QQ头像
          state.userImgUrl = data
        } else {
          state.userImgUrl = '/api' + data.split(".")[0] + "_min." + data.split(".")[1]
        }
      } else {
        state.userImgUrl = '/api'
      }
    },
    changeUserInfoObj(state,data) {
      state.userInfoObj = Object.assign({},state.userInfoObj,data)
    },
    changeNotReadDot(state,data) {
      state.notReadDot = data
    },
    changeNotReadCount(state,data) {
      state.notReadCount = data
    } 
  },
  actions: {
    getUserInfo(context) {
      return checkUserLoginInfo().then(res => {
        if(res.success) {
          context.commit("changeLogin", res.success)
          context.commit("changeUsername", res.data.username)
          context.commit("changeUserId", res.data.userId)
          context.commit('changeUserImgUrl',res.data.imageurl);
          context.commit('changeUserInfoObj',res.data)
        } else {
          context.commit("changeLogin", res.success)
        }
      })
    }
  }
})