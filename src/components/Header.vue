<template>
  <div class="headerWrapper">
    <img class="logo" :src="logoUrl" @click="$router.push({ name: 'Home' })" />
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item class="headerItem" index="1" :route="{ name: 'Home' }">首页</el-menu-item>
      <el-menu-item class="headerItem" index="2" :route="{ name: 'File', query: { filePath: '/', fileType: 0 } }"
        >网盘</el-menu-item
      >
      <el-menu-item class="headerItem" @click="goQiwenshareHome">
        社区
      </el-menu-item>
      <el-menu-item class="headerItem userDisplay right-menu-item" index="4" v-show="isLogin">
        <el-avatar :size="34" :src="userImgUrl" fit="cover">
          <img :src="userImgDefault" />
        </el-avatar>
        <span class="username-header">{{ username }}</span>
      </el-menu-item>
      <el-menu-item class="headerItem exit right-menu-item" v-show="isLogin" index="5" @click="exitButton()"
        >退出</el-menu-item
      >
      <el-menu-item class="headerItem login right-menu-item" v-show="!isLogin" index="6" :route="{ name: 'Login' }"
        >登录</el-menu-item
      >
      <!-- 生产环境 -->
      <el-menu-item
        v-if="isProductEnv"
        class="headerItem register right-menu-item"
        v-show="!isLogin"
        @click.native="goQiwenshare()"
      >
        注册
      </el-menu-item>
      <!-- 开发环境 -->
      <el-menu-item
        v-else
        class="headerItem register right-menu-item"
        v-show="!isLogin"
        index="7"
        :route="{ name: 'Register' }"
        >注册</el-menu-item
      >
    </el-menu>
  </div>
</template>

<script>
// import { logout } from '@/request/user.js'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/images/common/logo_header.png'),
      userImgDefault: require('@/assets/images/settings/userImg.png')
    }
  },
  computed: {
    ...mapGetters(['isLogin', 'userImgUrl', 'username']),
    activeIndex: {
      get() {
        let routerName = this.$route.name
        const ROUTERMAP = {
          Home: '1',
          File: '2',
          Login: '6',
          Register: '7'
        }
        return ROUTERMAP[routerName]
      },
      set() {
        return '1'
      }
    },
    isProductEnv() {
      return process.env.NODE_ENV !== 'development' && location.origin === 'https://pan.qiwenshare.com'
    }
  },
  methods: {
    // 跳转到奇文社区注册页面
    goQiwenshare() {
      window.open('https://www.qiwenshare.com/register')
    },
    // 跳转到奇文社区首页
    goQiwenshareHome() {
      window.open('https://www.qiwenshare.com/')
    },
    //  退出登录
    exitButton() {
      this.$message.success('退出登录成功！')
      if (document.location.host.indexOf('.qiwenshare.com') != -1) {
        Cookies.set('token', '', { domain: '.qiwenshare.com' })
      } else {
        Cookies.set('token', '')
      }
      this.$store.dispatch('getUserInfo').then(() => {
        sessionStorage.removeItem('operaColumnExpand')
        sessionStorage.removeItem('isFolder')
        sessionStorage.removeItem('selectedColumnList')
        this.$router.push({ path: '/login' })
      })
      // logout().then(res => {
      //   if (res.success) {
      //     this.$message.success(res.data)
      //     this.$store.dispatch('getUserInfo').then(() => {
      //       sessionStorage.removeItem('operaColumnExpand')
      //       sessionStorage.removeItem('isFolder')
      //       sessionStorage.removeItem('selectedColumnList')
      //       this.$router.push({ path: '/login' })
      //     })
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
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
  display flex
  >>> .el-menu--horizontal
    .el-menu-item:not(.is-disabled):hover
      border-bottom-color $Primary !important
      background $tabBackColor
  .logo
    margin 14px 24px 0 24px
    display inline-block
    height 40px
    cursor: pointer;
  .el-menu-demo
    flex: 1;
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
