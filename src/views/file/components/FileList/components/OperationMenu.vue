<template>
  <div class="operation-menu-wrapper">
    <el-upload
      class="upload-demo"
      multiple
      action="api/filetransfer/uploadfile/"
      :show-file-list="false"
      :data="uploadFileData"
      :on-success="uploadFileSuccess"
      :headers="headers"
    >
      <el-button size="medium" type="primary" icon="el-icon-upload2" id="uploadFileId">上传</el-button>
    </el-upload>

    <el-button size="medium" @click="addFolder()" v-if="!fileType">新建文件夹</el-button>

    <div style="display: inline-block;" v-if="selectionFile.length !== 0">
      <el-button size="medium" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="medium" icon="el-icon-edit" @click="moveSelectedFile()" v-if="!fileType">移动</el-button>
      <!-- <el-button size="medium" icon="el-icon-document-copy">拷贝</el-button> -->
      <el-button size="medium" icon="el-icon-download" @click="downloadSelectedFile()">下载</el-button>
    </div>

    <!-- 多选文件下载，页面隐藏 -->
    <a
      target="_blank"
      v-for="(item,index) in selectionFile"
      :key="index"
      :href="'api' + item.fileUrl"
      :download="item.fileName+'.' + item.extendName"
      :title="'downloadLink' + index"
      :ref="'downloadLink' + index"
    ></a>

    <div class="storeDisWrapper" style="float:right;">已使用 {{storageValue}} 容量</div>
  </div>
</template>

<script>
import {
  // deleteFile,
  batchDeleteFile,
  createFile
} from '@/request/file.js'

export default {
  name: 'OperationMenu',
  props: {
    selectionFile: Array,
    operationFile: Object,
    storageValue: String
  },
  data() {
    return {
      fileTree: [],
      headers: {},
      batchDeleteFileDialog: false
    }
  },
  computed: {
    //  当前查看的文件路径
    filePath: {
      get() {
        return this.$route.query.filePath
      },
      set() {
        return ''
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
    },
    //  上传文件组件参数
    uploadFileData: {
      get() {
        let res = {
          filePath: this.filePath,
          isDir: 0
        }
        return res
      },
      set() {
        return {
          filePath: '/',
          isDir: 0
        }
      }
    }
  },
  created() {
    let token = localStorage.getItem("token");
    this.headers.token = token
    this.handleEnterDown()
  },
  methods: {
    //  上传按钮
    uploadFileSuccess(result) {
      if (result.success) {
        this.$message.success('上传成功')
        this.$emit('getTableDataByType')
        this.$emit('showStorage')
      } else {
        this.$message.error(result.errorMessage)
      }
    },
    //  enter+down 新建文件夹，请不要删除
    handleEnterDown() {
      //  测试enter+down组合键触发事件
      let self = this
      let code1 = 0
      let code2 = 0

      document.onkeydown = function(e) {
        let evn = e || event
        let key = evn.keyCode || evn.which || evn.charCode

        // enter
        if (key === 13) {
          code1 = 13
          e.preventDefault() //禁止默认事件
        }
        // down keyup时及时的 归零
        if (key === 40) {
          code2 = 0
          e.preventDefault() //禁止默认事件
        }
      }
      document.onkeyup = function(e) {
        // enter keyup时及时的 归零
        if (e.keyCode === 13) {
          code1 = 0
        }
        //  down
        if (e.keyCode === 40) {
          code2 = 40
        }
        // enter+down
        if (code1 === 13 && code2 === 40) {
          console.log('enter + down')
          //  这里写你要触发的事件名称
          self.addFolder()
        }
      }
    },
    //  新建文件夹按钮：打开模态框
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
    //  新建文件夹模态框-确定按钮
    createFile(fileName) {
      let data = {
        fileName: fileName,
        filePath: this.filePath,
        isDir: 1
      }
      createFile(data).then(res => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('getTableDataByType')
        } else {
          this.$message.warning(res.errorMessage)
        }
      })
    },

    //  批量操作-删除按钮
    deleteSelectedFile() {
      let data = {
        files: JSON.stringify(this.selectionFile)
      }
      //  批量删除接口
      batchDeleteFile(data).then(res => {
        if (res.success) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.$emit('getTableDataByType')
          this.$emit('showStorage')
        } else {
          this.$message.error('失败' + res.errorMessage)
        }
      })
    },
    //  批量操作-移动按钮
    moveSelectedFile() {
      this.$emit('setMoveFileDialogData', true, true)
    },
    //  批量操作：下载按钮
    downloadSelectedFile() {
      for (let i = 0; i < this.selectionFile.length; i++) {
        let name = 'downloadLink' + i
        this.$refs[name][0].click()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.operation-menu-wrapper
  height 60px
  line-height 60px
  .upload-demo
    display inline-block
  .el-button--medium
    margin-left 10px
</style>