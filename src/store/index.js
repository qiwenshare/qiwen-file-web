import Vue from "vue";
import Vuex from "vuex";

import config from '@/config'

import user from './module/user'
import fileList from './module/fileList'
import sideMenu from './module/sideMenu'
import imgReview from './module/imgReview'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  getters: {
    isLogin: (state) => state.user.isLogin,
    username: (state) => state.user.username,
    userId: (state) => state.user.userId,
    userInfoObj: (state) => state.user.userInfoObj,
    selectedColumnList: (state) =>
      state.fileList.selectedColumnList === undefined
        ? config.allColumnList
        : state.fileList.selectedColumnList.split(","), //  列显隐
    fileModel: (state) => state.fileList.fileModel === undefined ? 0 : Number(state.fileList.fileModel), //  文件展示模式，0列表模式，1网格模式 2 时间线模式
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    fileList,
    sideMenu,
    imgReview
  }
})
