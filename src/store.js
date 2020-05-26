import Vue from "vue";
import Vuex from "vuex";
import { checkUserLoginInfo } from "@/request/user.js"; //引入axios封装

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false, //初始时候给一个 isLogin = false 表示用户未登录
    username: "",
    userId: 0,
    userImgUrl: "",
    userInfoObj: {},
    operaColumnExpand: sessionStorage.getItem("operaColumnExpand"), //  操作列是否展开，0不展开，1展开
    isFolder: sessionStorage.getItem("isFolder"), //  左侧栏是否折叠，0不折叠，1折叠
    selectedColumnList: sessionStorage.getItem("selectedColumnList"), //  列显隐
    imageModel: sessionStorage.getItem("imageModel"), //  图片类型页面是否展示为网格模式，0不是，1是
  },
  getters: {
    isLogin: (state) => state.isLogin,
    username: (state) => state.username,
    userId: (state) => state.userId,
    userImgUrl: (state) => state.userImgUrl,
    userInfoObj: (state) => state.userInfoObj,
    operaColumnExpand: (state) =>
      state.operaColumnExpand !== null
        ? Number(state.operaColumnExpand)
        : document.body.clientWidth > 1280
          ? 1
          : 0, //  操作列是否展开，0不展开，1展开
    isFolder: (state) => Number(state.isFolder), //  左侧栏是否折叠，0不折叠，1折叠
    selectedColumnList: (state) =>
      state.selectedColumnList
        ? state.selectedColumnList.split(",")
        : ["extendname", "filesize", "uploadtime"], //  列显隐
    imageModel: (state) => Number(state.imageModel), //  图片类型页面是否展示为网格模式，0不是，1是
  },
  mutations: {
    changeLogin(state, data) {
      state.isLogin = data;
    },
    changeUsername(state, data) {
      state.username = data;
    },
    changeUserId(state, data) {
      state.userId = data;
    },
    changeUserImgUrl(state, data) {
      if (data) {
        if (data.includes("http")) {
          //  若是QQ头像
          state.userImgUrl = data;
        } else {
          state.userImgUrl =
            "/api" + data.split(".")[0] + "_min." + data.split(".")[1];
        }
      } else {
        state.userImgUrl = "/api";
      }
    },
    changeUserInfoObj(state, data) {
      state.userInfoObj = Object.assign({}, state.userInfoObj, data);
    },
    changeOperaColumnExpand(state, data) {
      sessionStorage.setItem("operaColumnExpand", data);
      state.operaColumnExpand = data;
    },
    changeIsFolder(state, data) {
      sessionStorage.setItem("isFolder", data);
      state.isFolder = data;
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
    getUserInfo(context) {
      return checkUserLoginInfo().then((res) => {
        if (res.success) {
          context.commit("changeLogin", res.success);
          context.commit("changeUsername", res.data.username);
          context.commit("changeUserId", res.data.userId);
          context.commit("changeUserImgUrl", res.data.imageurl);
          context.commit("changeUserInfoObj", res.data);
        } else {
          context.commit("changeLogin", res.success);
        }
      });
    },
  },
});
