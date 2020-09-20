<template>
  <div class="aside-menu-wrapper" :class="{'expand': !isFolder}">
    <div class="aside-title">
      <!-- <i class="el-icon-share" v-show="!isFolder"></i> -->
      <span v-show="!isFolder">点击右侧收缩分类栏</span>
      <el-tooltip class="item" effect="dark" content="收起分类栏" placement="bottom-end">
        
        <i
          class="el-icon-s-fold"
          v-show="!isFolder"
          @click="$store.commit('changeIsFolder', 1)"
        ></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="展开分类栏" placement="bottom-start">
        <i
          class="el-icon-s-unfold"
          v-show="isFolder"
          @click="$store.commit('changeIsFolder', 0)"
        ></i>
      </el-tooltip>
    </div>
    <el-menu
      class="aside-menu"
      :default-openeds="[0]"
      :default-active="activeIndex"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <i class="el-icon-menu" title="全部"></i>
        <span slot="title" v-show="!isFolder">全部</span>
      </el-menu-item>
      <el-menu-item index="1" title="图片">
        <i class="el-icon-picture"></i>
        <span slot="title" v-show="!isFolder">图片</span>
      </el-menu-item>
      <el-menu-item index="2" title="文档">
        <i class="el-icon-document"></i>
        <span slot="title" v-show="!isFolder">文档</span>
      </el-menu-item>
      <el-menu-item index="3" title="视频">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title" v-show="!isFolder">视频</span>
      </el-menu-item>
      <el-menu-item index="4" title="音乐">
        <i class="el-icon-headset"></i>
        <span slot="title" v-show="!isFolder">音乐</span>
      </el-menu-item>
      <!-- <el-menu-item index="5" title="其他">
        <i class="el-icon-takeaway-box"></i>
        <span slot="title" v-show="!isFolder">其他</span>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
// import { selectFileByFileType } from '@/request/file.js'

export default {
  name: 'AsideMenu',
  data() {
    return {
      fileListByFiletype: []
    }
  },
  computed: {
    //  当前活跃菜单项index，也是当前被选中的文件类型
    activeIndex: {
      get() {
        return String(this.$route.query.fileType)
      },
      set() {
        return '0'
      }
    },
    //  判断当前用户设置的左侧栏是否折叠
    isFolder() {
      return this.$store.getters.isFolder
    }
  },
  methods: {
    //  导航菜单项点击事件
    handleSelect(index) {
      this.$router.push({
        path: '/file',
        query: { filePath: '/', fileType: index }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.aside-menu-wrapper
  width 69px
  transition width 0.5s
  -webkit-transition width 0.5s
  .aside-title
    background-color #C0C4CC;
    color #fff
    height 40px
    line-height 40px
    font-size 14px
    text-align center
    position relative
    .el-icon-s-fold
      position absolute
      right 6px
      top 10px
      cursor pointer
      font-size 20px
    .el-icon-s-unfold
      cursor pointer
      font-size 20px
  >>> .el-menu
    border none
    .el-menu-item.is-active
      background $PrimaryHover
.expand
  width 220px
  >>> .el-menu
    .el-menu-item
      padding-left 40px !important
</style>