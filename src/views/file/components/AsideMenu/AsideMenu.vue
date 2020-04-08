<template>
  <div class="aside-menu-wrapper">
    <div class="aside-title">
      <i class="el-icon-share"></i> 共享网盘(Beta)
    </div>
    <el-menu
      class="aside-menu"
      :default-openeds="['0']"
      :default-active="activeIndex"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <i class="el-icon-menu"></i>
        <span slot="title">全部</span>
      </el-menu-item>
      <el-menu-item index="1">
        <i class="el-icon-picture"></i>
        <span slot="title">图片</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-document"></i>
        <span slot="title">文档</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-video-camera-solid"></i>
        <span slot="title">视频</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-headset"></i>
        <span slot="title">音乐</span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="el-icon-takeaway-box"></i>
        <span slot="title">其他</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { selectFileByFileType } from '@/request/file.js'

export default {
  name: 'AsideMenu',
  data() {
    return {}
  },
  computed: {
    //  当前活跃菜单项index，也是当前被选中的文件类型
    activeIndex: {
      get() {
        return this.$route.query.filetype
      },
      set() {
        return '0'
      }
    }
  },
  methods: {
    //  导航菜单项点击事件
    handleSelect(index) {
      let filepath = this.$route.query.filepath
      this.$router.push({
        path: '/file',
        query: { filepath: filepath, filetype: index }
      })
      //  分类型
      if (index !== '0') {
        selectFileByFileType({ filetype: index }).then(res => {
          if (res.success) {
            console.log(res.data)
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.aside-menu-wrapper
  .aside-title
    background-color $Primary
    color #fff
    height 80px
    line-height 80px
    font-size 18px
    text-align center
  >>> .el-menu
    border none
    .el-menu-item
      padding-left 40px !important
    .el-menu-item.is-active
      background $PrimaryHover
</style>