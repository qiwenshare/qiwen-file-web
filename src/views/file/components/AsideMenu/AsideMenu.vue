<template>
  <div class="aside-menu-wrapper" :class="{'expand': !isFolder}">
    <el-tooltip effect="dark" :content="isFolder ? '展开分类栏' : '收起分类栏'" placement="right">
      <div class="aside-title" @click="$store.commit('changeIsFolder', isFolder ? 0 : 1)">
        <i class="el-icon-caret-left" v-show="!isFolder"></i>
        <i class="el-icon-caret-right" v-show="isFolder"></i>
      </div>
    </el-tooltip>
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
      <el-menu-item index="5" title="其他">
        <i class="el-icon-takeaway-box"></i>
        <span slot="title" v-show="!isFolder">其他</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
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
  position relative
  width 69px
  transition width 0.5s
  -webkit-transition width 0.5s
  .aside-title
    position absolute
    top 300px
    right 0
    z-index 2
    border-radius 12px 0 0 12px
    background $BorderLight
    color #fff
    width 12px
    height 100px
    line-height 100px
    cursor pointer
    &:hover
      opacity 0.7
    i {
      font-size 12px
    }
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