<template>
  <div class="operation-menu-wrapper">
    <el-button size="medium" type="primary" icon="el-icon-upload2" id="uploadFileId" @click="upload()">上传</el-button>
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
  createFile,
  speedUploadFile
} from '@/request/file.js'
import Cookies from 'js-cookie'
import SparkMD5 from 'spark-md5'

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
      batchDeleteFileDialog: false,
      objectMd5: {},
      uploadTotleCount:0,
      completeCount:0,
      percentage: 0,
      options: {
          target: 'api/filetransfer/uploadfile', // 目标上传 URL
          testChunks: true,  //是否开启服务器分片校验
          chunkSize: '2048000',   //分片大小
          fileParameterName: 'file', //上传文件时文件的参数名，默认file
          maxChunkRetries: 3,  //最大自动失败重试上传次数
          // 服务器分片校验函数，秒传及断点续传基础
          checkChunkUploadedByResponse: function (chunk, message) {
            let objMessage = JSON.parse(message);
            let data = objMessage.data;
            if (data.skipUpload) {
                return true;
            }
            return (data.uploaded || []).indexOf(chunk.offset + 1) >= 0
          },
          headers: {
        // 在header中添加的验证，请根据实际业务来
              token: Cookies.get('token', { domain: '.qiwenshare.com' })
          },
          query: this.uploadFileData
      },
      attrs: {
          accept: '*' //接受所有文件类型
      },
      panelShow: true,   //选择文件后，展示上传pan
      uploader_key: new Date().getTime(),
    }
  },
  mounted() {
    this.$EventBus.$on('refreshList', query => {
                console.log("收到消息了")
                this.$emit('getTableDataByType')
                
            });
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
    let token = Cookies.get('token', { domain: '.qiwenshare.com' });;
    this.headers.token = token
    this.handleEnterDown()
    this.options.query = this.uploadFileData
  },
  methods: {
    upload() {
        // 打开文件选择框
        this.$EventBus.$emit('openUploader', this.uploadFileData)
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
    },
    onPreview() {
      console.log("onPreview")
    },
    computeMD5(file) {
     
      
      let time = new Date().getTime();
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
      let currentChunk = 0;
      console.log("文件大小：" + file.size)
      const chunkSize = 10 * 1024 * 1000;
      console.log("块大小："+ chunkSize);
      let chunks = Math.ceil(file.size / chunkSize);
      console.log("块数量：" + chunks);
      let fileReader = new FileReader();
      // this.uploadFileData.fileName = fileObj.raw.name;
      //console.log("文件名：" + fileObj.raw.name);
      loadNext();
      //fileReader.readAsArrayBuffer(blobSlice(file))
      let spark = new SparkMD5.ArrayBuffer();
      
      let _this = this
      fileReader.onload = (e => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          console.log('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
        } else {
          let md5 = spark.end();
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
          this.computeMD5Success(md5, file);
        }
        // var md5 = spark.end()
        // console.log(md5)
        //_this.objectMd5[fileObj.raw.name] = md5
        // _this.completeCount++
        // let percentage = (_this.completeCount/_this.uploadTotleCount * 100).toFixed(0)
        // _this.format(percentage * 1)
        // _this.percentage = percentage * 1
        // console.log(_this.percentage)
        
      });
      function loadNext() {
          let start = currentChunk * chunkSize;
          let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
        }
      
       
    },
    computeMD5Success(md5, file) {
      console.log(md5)
      console.log(file)
      file.uniqueIdentifier = md5;//把md5值作为文件的识别码
      this.options.fileName = file.name;
      // file.fileName = file.  
      file.resume();//开始上传
      console.log('开始上传')
    },
    // 添加文件的回调
    filesAdded(file, event) {
      console.log(file)
      //大小判断
      //const isLt100M = file.size / 1024 / 1024 < 10;
      // if (!isLt100M) {
      //   this.$message.error(this.$t("error.error_upload_file_max"));
      // } else {
      //   this.computeMD5(file)
      // }
      this.computeMD5(file)
    },
    // 文件上传过程中进度的回调
    onFileProgress(rootFile, file, chunk) {
        console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 文件上传成功的回调
    onFileSuccess(rootFile, file, response, chunk){
      console.log(rootFile)
      console.log(file)
      console.log(response)
      let data = response.data
      let result = JSON.parse(response)
      // let timeStampName = response.data.timeStampName;
      // // debugger;
      // this.uploadFileData.timeStampName = timeStampName
      if (result.success) {
        this.$message.success('上传成功')
        this.$emit('getTableDataByType')
        this.$emit('showStorage')
      } else {
        this.$message.error(result.errorMessage)
      }
      console.log(chunk)
    },
    // 上传文件出错回调
    onFileError(rootFile, file, response, chunk) {
      let result = JSON.parse(response)
      this.$message.error(result.errorMessage)
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