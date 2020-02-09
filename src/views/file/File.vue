<template>
  <div class="fileWrapper">
    <el-container class="el-container">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
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
  },
  created() {
    this.$emit('footer', false)
  }
}
</script>

<style lang="stylus" scoped>
.fileWrapper
  width: 100% !important
.el-container
  height: 90vh
.el-main
  padding-top: 0px !important
  overflow: hidden
</style>