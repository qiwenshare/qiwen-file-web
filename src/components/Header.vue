<template>
  <div class="headerWrapper">
    <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
      <el-menu-item class="headerLogo" disabled>
        <a href="https://www.qiwenshare.com/" target="_blank">
          <img class="logo" :src="logoUrl" />
        </a>
      </el-menu-item>
      <el-menu-item class="headerItem" index="1">
        网盘
      </el-menu-item>
      <el-submenu index="11" class="headerItem userDisplay right-menu-item" v-show="loginState">
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
      >登录</router-link>
      <router-link
        tag="el-menu-item"
        class="headerItem register right-menu-item"
        index="8"
        to="/register"
        v-show="!loginState"
      >注册</router-link>
    </el-menu>
  </div>
</template>

<script>
import { logout } from '@/request/user.js'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/images/common/logo_header.png'),
      userImgDefault: require('@/assets/images/settings/userImg.png'),
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
    }
  },
  methods: {
    //  退出登录
    exitButton() {
      logout().then(res => {
        if (res.success) {
          this.$message.success(res.data)
          this.$store.dispatch('getUserInfo').then(() => {
            this.$router.push({ path: '/login' })
          })
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.headerWrapper
  width 100%
  padding 0 20px
  box-shadow $tabBoxShadow
  >>> .el-menu--horizontal 
    .el-menu-item:not(.is-disabled):hover
      border-bottom-color $Primary !important
      background $tabBackColor
  .el-menu-demo
    display flex
    position relative
    .headerLogo
      color $Primary
      font-size 60px
      opacity 1
      cursor default
      a
        display block
      .logo
        height 40px
        vertical-align baseline
    .right-menu-item
      position absolute
    .userDisplay
      right 0px
      width 180px
      .username-header
        margin-left 6px
        min-width 60px
        display inline-block
        text-align center
    .login
      right 70px
    .register
      right 0px
</style>
