<template>
  <div id="app">
    <Header v-if="isHeaderShow" id="headWrapper"></Header>
    <router-view class="mainContent"></router-view>
    <Footer v-if="isFooterShow"></Footer>
    <el-backtop class="backtop" target="#app" title="回到顶部"></el-backtop>
    <!-- 将上传组件全局注册 -->
    <global-uploader v-if="isGlobalUploaderShow"></global-uploader>
    <!-- 查看大图 -->
    <ImgReview v-if="isImgReviewShow"></ImgReview>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import globalUploader from '@/components//common/GlobalUploader.vue'
import ImgReview from '@/components/common/ImgReview'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    globalUploader,
    ImgReview
  },
  computed: {
    //  头部是否显示
    isHeaderShow() {
      let routerNameList = ['Error_401', 'Error_404', 'Error_500']
      return routerNameList.includes(this.$route.name) ? false : true
    },
    //  底部是否显示
    isFooterShow() {
      let routerNameList = ['File', 'Share', 'MyShare', 'Error_401', 'Error_404', 'Error_500']
      return routerNameList.includes(this.$route.name) ? false : true
    },
    // 全局上传组件是否显示
    isGlobalUploaderShow() {
      let routerNameList = ['Login', 'Register']
      return routerNameList.includes(this.$route.name) ? false : true
    },
    // 图片预览组件是否显示
    isImgReviewShow() {
      let routerNameList = ['Login', 'Register']
      return routerNameList.includes(this.$route.name) ? false : true
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';

#app {
  height: 100%;
  overflow-x: hidden;
  -webkit-text-size-adjust: none;
  overflow-y: auto;

  >>> .el-backtop {
    background-color: $Success;
    color: #fff;
    z-index: 3;
  }

  .mainContent {
    flex: 1;
    width: 90%;
    min-height: calc(100vh - 70px);
    margin: 0 auto;
    display: flex;
  }
}
</style>
