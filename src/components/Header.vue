<template>
  <div class="headerWrapper">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item class="iconfont headerLogo" disabled>
        <img class="logo" :src="logoUrl" />
      </el-menu-item>
      <router-link
        tag="el-menu-item"
        v-for="(item,index) of headerList"
        :key="index"
        :index="item.index"
        :class="item.name+' '+item.state"
        class="headerItem"
        :to="item.link"
        exact
      >{{item.text}}</router-link>
      <el-submenu index="11" class="userDisplay rightWrapper" v-show="loginState">
        <template class="userDisplayList" slot="title">
          <!-- src赋值默认头像 -->
          <el-avatar :size="34" :src="userImgUrl" @error="errorHandler" fit="cover">
            <img :src="userImgDefault" />
          </el-avatar>
          {{username}}
        </template>
        
        <el-menu-item index="11-4" @click="exitButton()">
          <i class="el-icon-s-promotion"></i>退出
        </el-menu-item>
      </el-submenu>
      
      <!-- <el-menu-item index="8" class="register rightWrapper" v-show="!loginState">
        注册
      </el-menu-item>-->
      <router-link
        tag="el-menu-item"
        class="register rightWrapper"
        index="8"
        to="/register"
        v-show="!loginState"
      >注册</router-link>
      <router-link
        tag="el-menu-item"
        class="login rightWrapper"
        index="7"
        to="/login"
        v-show="!loginState"
      >登录</router-link>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      logoUrl: require("@/assets/images/common/logo1.png"),
      userImgDefault: require("@/assets/images/settings/userImg.png"),
      activeIndex: "0",
      headerList: [
        {
          index: "0",
          name: "file",
          link: "/file",
          text: "共享网盘",
          state: "normal"
        }
      ]
    };
  },
  computed: {
    loginState() {
      return this.$store.state.isLogin;
    },
    userImgUrl() {
      return this.$store.state.userImgUrl;
    },
    username() {
      return this.$store.state.username;
    }
  },
  methods: {
    async exitButton() {
      await this.$http.logout(function() {});
      this.$store.commit("changeLogin", false);
      this.$router.push({ path: "/login" });
    },
    async checkUserLoginInfo() {
      let res = await this.$http.checkUserLoginInfo();
      this.$store.commit("changeLogin", res.data.success);
      if (res.data.success == true) {
        this.$store.commit("changeUsername", res.data.data.username);
        this.$store.commit("changeUserId", res.data.data.userId);
        this.$store.commit(
          "changeUserImgUrl",
          res.data.data.imageBeanList[res.data.data.imageBeanList.length - 1]
            .imageurl
        );
      }
    },
    //  图片回显错误
    errorHandler(e) {
      console.log(e);
      return true;
    }
  },
  created() {
    this.checkUserLoginInfo();
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

.headerWrapper {
  width: 100%;
  padding: 0 20px;
  box-shadow: $tabBoxShadow;

  >>> .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    border-bottom-color: $Primary !important;
  }

  .el-menu-demo {
    .headerLogo {
      color: $Primary;
      font-size: 60px;
      opacity: 1;
      cursor: default;

      .logo {
        height: 60px;
        vertical-align: sub;
      }
    }

    .router-link-active {
      border-bottom-color: $Primary !important;
      color: $Primary !important;
    }

    .rightWrapper {
      float: right;

      .el-icon-edit {
        color: $Primary;
      }

      .el-icon-bell {
        color: $Primary;
      }
    }
  }
}

.el-menu--horizontal {
  .el-menu-item:not(.is-disabled):hover {
    background: $tabBackColor;

    [class^=el-icon-] {
      color: $Primary;
    }
  }
}
</style>
