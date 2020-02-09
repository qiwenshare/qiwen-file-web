<template>
  <div>
    <el-menu :default-openeds="['1', '3']">
      <el-submenu index="1">
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
      </el-submenu>
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
  methods: {
    selectFileByFileType(filetype) {
      let filepath = this.$route.query.filepath
      this.$router.push({
        path: '/file',
        query: { filepath: filepath, filetype: filetype }
      })
      selectFileByFileType(filetype).then(res => {
        if (res.success) {
          console.log(res.data)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>