<template>
  <div id="app">
    <Header v-if="isHeaderShow" id="headWrapper"></Header>
    <keep-alive>
      <router-view class="mainContent" :key="$route.fullPath"></router-view>
    </keep-alive>
    <Footer v-if="isFooterShow"></Footer>
    <el-backtop class="backtop" target="#app" title="快点我，带你上天！"></el-backtop>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  computed: {
    //  头部是否显示
    isHeaderShow() {
      let routerNameList = ['Error_401', 'Error_404', 'Error_500']
      if (routerNameList.includes(this.$route.name)) {
        return false
      } else {
        return true
      }
    },
    //  底部是否显示
    isFooterShow() {
      let routerNameList = [
        'Login',
        'Register',
        'File',
        'Error_401',
        'Error_404',
        'Error_500'
      ]
      if (routerNameList.includes(this.$route.name)) {
        return false
      } else {
        return true
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
#app
  height 100vh
  overflow-x hidden
  -webkit-text-size-adjust none
  display flex
  flex-direction column
  overflow-y auto
  >>> .el-backtop
    background-color $Success
    color #fff
    z-index 3
  .mainContent
    flex 1
    width 90%
    margin 0 auto
    display flex
</style>
