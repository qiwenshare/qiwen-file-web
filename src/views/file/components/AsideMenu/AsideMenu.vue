<template>
  <div class="aside-menu-wrapper">
    <div class="aside-title">
      <i class="el-icon-share"></i> 共享网盘(Beta)
    </div>
    <el-menu class="aside-menu" :default-openeds="['0']" :default-active="activeIndex" @select="handleSelect">
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
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document-copy"></i>共享网盘(beta)
        </template>
        <el-menu-item-group>
          <el-menu-item index="1-1" @click="selectFileByFileType(1)">图片</el-menu-item>
          <el-menu-item index="1-2" @click="selectFileByFileType(2)">文档</el-menu-item>
          <el-menu-item index="1-3" @click="selectFileByFileType(3)">视频</el-menu-item>
          <el-menu-item index="1-4" @click="selectFileByFileType(4)">音乐</el-menu-item>
          <el-menu-item index="1-5">其他</el-menu-item>
        </el-menu-item-group>
      </el-submenu>-->
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
    handleSelect(index) {
      //  分类型
      let filepath = this.$route.query.filepath
      this.$router.push({
        path: '/file',
        query: { filepath: filepath, filetype: index }
      })
      if (index !== '0') {
        selectFileByFileType({ filetype: index }).then(res => {
          if (res.success) {
            console.log(res.data)
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      } 
      // else {
      //   //   不分类型，即全部文件
      //   this.$router.push({
      //     path: '/file'
      //   })
      // }
    }
    // selectFileByFileType(filetype) {
    //   let filepath = this.$route.query.filepath
    //   this.$router.push({
    //     path: '/file',
    //     query: { filepath: filepath, filetype: filetype }
    //   })
    //   selectFileByFileType({filetype:filetype}).then(res => {
    //     if (res.success) {
    //       console.log(res.data)
    //     } else {
    //       this.$message.error(res.errorMessage)
    //     }
    //   })
    // }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.aside-menu-wrapper
  .aside-title
    background $tabBackColor
    padding-left 20px
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