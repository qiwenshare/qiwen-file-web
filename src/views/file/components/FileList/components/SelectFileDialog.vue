<template>
  <!--选择目录弹出窗dialog-->
  <el-dialog title="选择目录" :visible.sync="dialogMoveFileVisible">
    <div class="el-dialog-div">
      <el-tree
        :data="fileTree"
        :props="defaultProps"
        :highlight-current="true"
        @node-click="selectNodeClick"
      ></el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogMoveFileVisible = false">取 消</el-button>
      <el-button type="primary" @click="batchMoveFile">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { moveFile, batchMoveFile, getFileTree } from '@/request/file.js'

export default {
  name: 'SelectFileDialog',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogMoveFileVisible: false,
      selectionFile: [],
      fileTree: [],
      selectFilePath: '' //移动文件路径
    }
  },
  methods: {
    confirmMoveFile() {
      this.dialogMoveFileVisible = false
      let data = {
        oldfilepath: this.operationFile.filepath,
        newfilepath: this.selectFilePath,
        filename: this.operationFile.filename,
        extendname: this.operationFile.extendname
      }
      moveFile(data).then(res => {
        if (res.success) {
          this.userInfoList.infoList.fan.count = res.data
          this.showFileList(this.filepath)
          this.$message.success('移动文件成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    batchMoveFile() {
      this.dialogMoveFileVisible = false
      console.log(JSON.stringify(this.selectionFile))
      let data = {
        newfilepath: this.selectFilePath,
        files: JSON.stringify(this.selectionFile)
      }
      batchMoveFile(data).then(res => {
        if (res.success) {
          this.$message.success(res.data)
          this.$emit('showFileList', this.filepath)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    selectNodeClick: function(data) {
      if (data.attributes.filepath == null) {
        this.selectFilePath = '/'
      } else {
        this.selectFilePath = data.attributes.filepath
      }
    },
    showMoveFileDialog(file) {
      this.selectionFile = file
      this.dialogMoveFileVisible = true
      this.initFileTree()
    },
    initFileTree() {
      getFileTree().then(res => {
        if (res.success) {
          this.fileTree = [res.data]
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