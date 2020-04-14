<template>
  <div class="headerWrapper">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item class="headerLogo" :index="0" disabled>
        <a href="https://www.qiwenshare.com/" target="_blank">
          <img class="logo" :src="logoUrl" />
        </a>
      </el-menu-item>
      <el-menu-item
        class="headerItem"
        :index="1"
        :route="{ name: 'File', query: { filepath: '/', filetype: 0 } }"
      >网盘</el-menu-item>
      <el-menu-item class="headerItem userDisplay right-menu-item" index="2" v-show="loginState">
        <el-avatar :size="34" :src="userImgUrl" fit="cover">
          <img :src="userImgDefault" />
        </el-avatar>
        <span class="username-header">{{ username }}</span>
      </el-menu-item>
      <el-menu-item
        class="headerItem exit right-menu-item"
        v-show="loginState"
        :index="3"
        @click="exitButton()"
      >退出</el-menu-item>
      <el-menu-item
        class="headerItem login right-menu-item"
        v-show="!loginState"
        :index="4"
        :route="{ name: 'Login' }"
      >登录</el-menu-item>
      <el-menu-item
        class="headerItem register right-menu-item"
        v-show="!loginState"
        :index="5"
        :route="{ name: 'Register' }"
      >注册</el-menu-item>
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
      userImgDefault: require('@/assets/images/settings/userImg.png')
    }
  },
  computed: {
    activeIndex: {
      get() {
        let routerName = this.$route.name
        const ROUTERMAP = {
          File: 1,
          Login: 4,
          Register: 5
        }
        console.log(routerName, ROUTERMAP[routerName])
        return ROUTERMAP[routerName]
      },
      set() {
        return 1
      }
    },
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
            sessionStorage.removeItem('operaColumnExpand')
            sessionStorage.removeItem('isFolder')
            sessionStorage.removeItem('selectedColumnList')
            sessionStorage.removeItem('isImageGrid')
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
      right 70px
      width 180px
      .username-header
        margin-left 6px
        min-width 60px
        display inline-block
        text-align center
    .exit
      right 0
    .login
      right 70px
    .register
      right 0px
</style>
