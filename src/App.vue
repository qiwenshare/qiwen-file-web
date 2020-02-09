<template>
  <div id="app">
    <Header v-if="header_show" id="headWrapper"></Header>
    <keep-alive>
      <router-view
        v-on:header="header"
        v-on:footer="footer"
        class="mainContent"
        :key="$route.fullPath"
      ></router-view>
    </keep-alive>
    <Footer v-if="footer_show"></Footer>
    <el-backtop
      class="backtop"
      target="#app"
      title="快点我，带你上天！"
    ></el-backtop>
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
  data() {
    return {
      header_show: true,
      footer_show: true
    }
  },
  methods: {
    //是否显示头部
    header(bool) {
      this.header_show = bool
    },
    //是否显示底部
    footer(bool) {
      this.footer_show = bool
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
#app
  height: 100vh
  overflow-x: hidden
  -webkit-text-size-adjust: none
  display: flex
  flex-direction: column
  overflow-y: auto
  >>> .el-backtop
    background-color: $Success
    color: #fff
    z-index: 3
  .mainContent
    flex: 1
    width: 90%
    margin: 0 auto
    display: flex
</style>
