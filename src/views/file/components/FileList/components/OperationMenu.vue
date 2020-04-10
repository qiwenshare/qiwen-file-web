<template>
  <div class="operation-menu-wrapper">
    <el-upload
      class="upload-demo"
      multiple
      action="api/filetransfer/uploadfile/"
      :show-file-list="false"
      :data="uploadFileData"
      :on-success="uploadFileSuccess"
    >
      <el-button size="medium" type="primary" icon="el-icon-upload2" id="uploadFileId">上传</el-button>
    </el-upload>

    <el-button size="medium" @click="addFolder()">新建文件夹</el-button>

    <div style="display: inline-block;" v-if="selectionFile.length !== 0">
      <el-button size="medium" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="medium" icon="el-icon-edit" @click="moveSelectedFile()">移动</el-button>
      <!-- <el-button size="medium" icon="el-icon-document-copy">拷贝</el-button> -->
      <el-button size="medium" icon="el-icon-download" @click="downloadSelectedFile()">下载</el-button>
    </div>

    <!-- 多选文件下载，页面隐藏 -->
    <a
      target="_blank"
      v-for="(item,index) in selectionFile"
      :key="index"
      :href="'api' + item.fileurl"
      :download="item.filename+'.' + item.extendname"
      :title="'downloadLink' + index"
      :ref="'downloadLink' + index"
    ></a>

    <div class="storeDisWrapper" style="float:right;">已使用 {{storageValue}} 容量</div>
  </div>
</template>

<script>
import {
  deleteFile,
  // batchDeleteFile,
  createFile,
  getstorage
} from '@/request/file.js'

export default {
  name: 'OperationMenu',
  props: {
    selectionFile: Array,
    operationFile: Object
  },
  data() {
    return {
      storageValue: 0,
      fileTree: [],
      batchDeleteFileDialog: false
    }
  },
  computed: {
    //  当前查看的文件路径
    filepath: {
      get() {
        return this.$route.query.filepath
      },
      set() {
        return ''
      }
    },
    //  上传文件组件参数
    uploadFileData: {
      get() {
        let res = {
          filepath: this.filepath,
          isdir: 0
        }
        return res
      },
      set() {
        return {
          filepath: '/',
          isdir: 0
        }
      }
    }
  },
  created() {
    this.showStorage()
    this.handleEnterDown()
  },
  methods: {
    //  上传按钮
    uploadFileSuccess(result) {
      if (result.success) {
        this.$message.success('上传成功')
        this.$emit('showFileList')
        this.showStorage()
      } else {
        this.$message.error(result.errorMessage)
      }
    },
    //  enter+down 新建文件夹
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
        filename: fileName,
        filepath: this.filepath,
        isdir: 1
      }
      createFile(data).then(res => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('showFileList')
        } else {
          this.$message.warning(res.errorMessage)
        }
      })
    },
    //  获取已占用内存
    showStorage() {
      getstorage().then(res => {
        if (res.success) {
          let size = res.data.storagesize
          const B = 1024
          const KB = Math.pow(1024, 2)
          const MB = Math.pow(1024, 3)
          const GB = Math.pow(1024, 4)
          if (!size) {
            this.storageValue = 0 + 'KB'
          } else if (size < KB) {
            this.storageValue = (size / B).toFixed(0) + 'KB'
          } else if (size < MB) {
            this.storageValue = (size / KB).toFixed(2) + 'MB'
          } else if (size < GB) {
            this.storageValue = (size / MB).toFixed(3) + 'GB'
          } else {
            this.storageValue = (size / GB).toFixed(4) + 'TB'
          }
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },

    //  批量操作-删除按钮
    deleteSelectedFile() {
      //  批量删除接口报错，暂时先用循环数组，单个删除接口代替
      this.selectionFile.forEach(element => {
        deleteFile(element).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      })
      this.$emit('showFileList')
      // console.log(JSON.stringify(this.selectionFile))
      // let data = {
      //   files: this.selectionFile
      // }
      //  此接口报错
      /*
      batchDeleteFile(data).then(res => {
        if (res.success) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.$emit('showFileList')
          this.showStorage()
        } else {
          this.$message.error('失败' + res.errorMessage)
        }
      })
      */
    },
    //  批量操作-移动按钮
    moveSelectedFile() {
      this.$emit('showFileTreeDialog', true)
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