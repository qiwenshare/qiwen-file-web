<template>
  <div id="app">
    <Header v-if="header_show" id="headWrapper"></Header>
    <router-view v-on:header="header" v-on:footer="footer" class="mainContent" />
    <Footer v-if="footer_show"></Footer>
    <el-backtop class="backtop" target="#app" title="快点我，带你上天！"></el-backtop>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  data() {
    return {
      header_show: true,
      footer_show: true
    };
  },
  methods: {
    //是否显示头部
    header: function(bool) {
      this.header_show = bool;
    },
    //是否显示底部
    footer: function(bool) {
      this.footer_show = bool;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';

#app {
  height: 100vh;
  overflow-x: hidden;

  >>> .el-backtop {
    background-color: $Success;
    color: #fff;
    z-index: 3;
  }

  .mainContent {
    width: 1170px;
    margin: 0 auto;
  }
}
</style>
