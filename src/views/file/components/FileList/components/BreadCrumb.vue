<template>
  <div class="breadcrumb-wrapper">
    <div class="title">当前位置：</div>
    <el-breadcrumb v-if="fileType" separator="/">
      <el-breadcrumb-item>{{fileTypeMap[fileType]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb v-else separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="index"
        :to="{ query: { filePath: item.path, fileType: 0 } }"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  data() {
    return {
      fileTypeMap: {
        1: '全部图片',
        2: '全部文档',
        3: '全部视频',
        4: '全部音乐',
        5: '其他',
        6: '回收站'
      }
    }
  },
  computed: {
    //  面包屑导航栏数组
    breadCrumbList: {
      get() {
        let filePath = this.$route.query.filePath
        let filePathList = filePath ? filePath.split('/') : []
        let res = [] //  返回结果数组
        let _path = [] //  存放祖先路径
        for (let i = 0; i < filePathList.length; i++) {
          if (filePathList[i]) {
            _path.push(filePathList[i] + '/')
            res.push({
              path: _path.join(''),
              name: filePathList[i]
            })
          } else if (i === 0) {
            //  根目录
            filePathList[i] = '/'
            _path.push(filePathList[i])
            res.push({
              path: '/',
              name: '全部文件'
            })
          }
        }
        return res
      },
      set() {
        return []
      }
    },
    //  文件类型索引
    fileType: {
      get() {
        return Number(this.$route.query.fileType)
      },
      set() {
        return 0
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.breadcrumb-wrapper
  padding 0
  height 30px
  line-height 30px
  display flex
  .title, >>> .el-breadcrumb
    height 30px
    line-height 30px
</style>