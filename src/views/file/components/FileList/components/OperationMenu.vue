<template>
  <div>
    <el-upload
      class="upload-demo"
      action="api/filetransfer/uploadfile/"
      :data="uploadFileData"
      multiple
      :show-file-list="false"
      :on-success="onUploadSuccess"
    >
      <el-button size="medium" type="primary" icon="el-icon-upload2" id="uploadFileId">上传</el-button>
    </el-upload>

    <el-button size="medium" @click="addFolder()">新建文件夹</el-button>

    <el-button-group v-if="selectionFile.length !== 0">
      <el-button size="medium" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="medium" icon="el-icon-edit" @click="moveSelectedFile()">移动</el-button>
      <el-button size="medium" icon="el-icon-document-copy">拷贝</el-button>
      <el-button size="medium" icon="el-icon-download" @click="downloadSelectedFile()">下载</el-button>
    </el-button-group>

    <!-- 多选文件下载，页面隐藏 -->
    <a v-for="(item,index) in selectionFile" 
      :key="index"
      :href="item.url" target="_blank" :download="item.filename+'.' + item.extendname"
      :title="'downloadLink' + index"
      :ref="'downloadLink' + index"
    ></a>

    <div class="storeDisWrapper" style="float:right;">
      已使用
      <span id="storageid">{{storageValue}}</span>M容量
    </div>
    <SelectFileDialog ref="SelectFileDialog"></SelectFileDialog>
  </div>
</template>

<script>
import SelectFileDialog from './SelectFileDialog'
import { batchDeleteFile, createFile, getstorage } from '@/request/file.js'

export default {
  name: 'OperationMenu',
  data() {
    return {
      storageValue: ''
    }
  },
  components: {
    SelectFileDialog
  },
  computed: {
    uploadFileData() {
      let filepath = this.$route.query.filepath
      let res = {
        filepath: (filepath === undefined || filepath === null || filepath === '' || filepath === '/') ?  '/' : filepath,
        isdir: 0
      }
      return res
    }
  },
  props: {
    filepath: String,
    selectionFile: Array,
    operationFile: Object
  },
  created() {
    this.showStorage()
  },
  methods: {
    moveSelectedFile() {
      this.$refs.SelectFileDialog.showMoveFileDialog(this.selectionFile)
    },
    deleteSelectedFile() {
      console.log(JSON.stringify(this.selectionFile))
      let data = {
        files: JSON.stringify(this.selectionFile)
      }
      batchDeleteFile(data).then(res => {
        if (res.success) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.$emit('showFileList', this.filepath)
        } else {
          this.$message.error('失败' + res.errorMessage)
        }
      })
    },
    //  下载文件
    downloadSelectedFile(){
      for(let i = 0; i < this.selectionFile.length; i++) {
        let name = 'downloadLink' + i
        this.$refs[name][0].click()
      }
    },
    onUploadSuccess(result) {
      if (result.success) {
        this.$message.success('上传成功')
        this.$emit('showFileList', this.filepath)
      } else {
        this.$message.error(result.errorMessage)
      }
    },
    addFolder() {
      this.$prompt('请输入文件夹名称', '创建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.createFile(value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    createFile(fileName) {
      let data = {
        filename: fileName,
        filepath: this.filepath,
        isdir: 1
      }
      createFile(data).then(res => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('showFileList', this.filepath)
        } else {
          this.$message.warning(res.errorMessage)
        }
      })
    },
    showStorage() {
      getstorage().then(res => {
        if (res.success) {
          this.storageValue = (res.data.storagesize / (1024 * 1024)).toFixed(2)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>

<style scoped>
.upload-demo {
  display: inline-block;
}
.el-button--medium {
  margin-left: 10px;
}
</style>