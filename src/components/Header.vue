<template>
  <div class="headerWrapper">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
    >
      <el-menu-item class="iconfont headerLogo" disabled>
        <img class="logo" :src="logoUrl" />
      </el-menu-item>
      <router-link
        tag="el-menu-item"
        v-for="(item, index) of headerList"
        :key="index"
        :index="item.index"
        :class="item.name + ' ' + item.state"
        class="headerItem"
        :to="item.link"
        exact
        >{{ item.text }}</router-link
      >
      <el-submenu
        index="11"
        class="headerItem userDisplay right-menu-item"
        v-show="loginState"
      >
        <template class="userDisplayList" slot="title">
          <el-avatar :size="34" :src="userImgUrl" fit="cover">
            <img :src="userImgDefault" />
          </el-avatar>
          <span class="username-header">{{ username }}</span>
        </template>
        <el-menu-item index="11-4" @click="exitButton()">
          <i class="el-icon-s-promotion"></i>退出
        </el-menu-item>
      </el-submenu>
      <router-link
        tag="el-menu-item"
        class="headerItem login right-menu-item"
        index="7"
        to="/login"
        v-show="!loginState"
        >登录</router-link
      >
      <router-link
        tag="el-menu-item"
        class="headerItem register right-menu-item"
        index="8"
        to="/register"
        v-show="!loginState"
        >注册</router-link
      >
    </el-menu>
  </div>
</template>

<script>
import { logout } from '@/request/user.js'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/images/common/logo2.png'),
      userImgDefault: require('@/assets/images/settings/userImg.png'),
      keyword: '',
      activeIndex: '0',
      headerList: [
        {
          index: '3',
          name: 'file',
          link: '/file',
          text: '共享网盘',
          state: 'normal'
        }
      ]
    }
  },
  computed: {
    loginState() {
      return this.$store.state.isLogin
    },
    userImgUrl() {
      return this.$store.state.userImgUrl
    },
    username() {
      return this.$store.state.username
    },
    notReadDot() {
      return this.$store.state.notReadDot
    },
    notReadCount() {
      return this.$store.state.notReadCount
    }
  },
  methods: {
    //  退出登录
    exitButton() {
      logout().then(res => {
        if(res.success) {
          this.$message.success(res.data)
          this.$store.dispatch('getUserInfo').then(() => {
            this.$router.push({ path: '/login' })
          })
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    handleSelect(item) {
      this.$router.push({
        name: 'EssayDetail',
        params: {
          essayId: item.essayId
        }
      })
      this.keyword = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'
.headerWrapper
  width: 100%
  padding: 0 20px
  box-shadow: $tabBoxShadow
  >>> .el-menu--horizontal .el-menu-item:not(.is-disabled):hover
    border-bottom-color: $Primary !important
  .el-menu-demo
    display: flex
    position: relative
    .headerLogo
      color: $Primary
      font-size: 60px
      opacity: 1
      cursor: default
      .logo
        height: 60px
        vertical-align: sub
    .router-link-active
      border-bottom-color: $Primary !important
      color: $Primary !important
    .search-input
      height: 60px !important
      line-height: 60px
      padding-left: 30px
      flex: 1
      max-width: 300px
    .right-menu-item
      position: absolute
      .el-icon-edit
        color: $Primary
      .el-icon-bell
        color: $Primary
    .writeEssay
      right: 305px
    .messageCenter
      right: 180px
      .not-read-dot
        height 30px
        line-height 30px
        >>> .el-badge__content.is-fixed
          right 4px
    .userDisplay
      right: 0px
      width 180px
      .username-header
        margin-left: 6px
        min-width: 60px
        display: inline-block
        text-align: center
    .login
      right: 70px
    .register
      right: 0px
.el-menu--horizontal
  .el-menu-item:not(.is-disabled):hover
    background: $tabBackColor
    [class^=el-icon-]
      color: $Primary
</style>
