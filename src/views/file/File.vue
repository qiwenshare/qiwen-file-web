<template>
  <div class="file-wrapper">
    <el-container class="el-container">
      <el-aside width="auto">
        <AsideMenu></AsideMenu>
      </el-aside>
      <el-container>
        <el-main class="el-main">
          <FileList></FileList>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsideMenu from './components/AsideMenu/AsideMenu'
import FileList from './components/FileList/FileList'

export default {
  name: 'File',
  components: {
    AsideMenu,
    FileList
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.file-wrapper
  width 100% !important
.el-container
  .el-aside
    border-right solid 1px $BorderLight
    height calc(100vh - 70px)
    /* 修改 滚动条 下面 的 宽度 */
    &::-webkit-scrollbar
      width 4px
    /* 修改 滚动条的 下面 的 样式 */
    &::-webkit-scrollbar-track
      background-color #EBEEF5
      -webkit-border-radius 2em
      -moz-border-radius 2em
      border-radius 2em
    /* 修改 滑块 */
    &::-webkit-scrollbar-thumb
      background-color #909399
      -webkit-border-radius 2em
      -moz-border-radius 2em
      border-radius 2em
.el-main
  padding-top 0px !important
  overflow hidden
</style>