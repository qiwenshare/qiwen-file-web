<template>
  <div id="global-uploader">
		<!-- 上传文件组件 -->
    <uploader
      class="uploader-app"
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="handleFileAdded"
      @file-success="handleFileSuccess"
      @file-progress="handleFileProgress"
      @file-error="handleFileError"
    >
      <uploader-unsupport></uploader-unsupport>
			<!-- 选择按钮 在这里隐藏 -->
      <uploader-btn class="select-file-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
			<!-- 上传列表 -->
      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{ collapse: collapse }">
          <div class="file-title">
            <span class="title-span">上传列表</span>
            <div class="operate">
              <el-button
                type="text"
                :title="collapse ? '展开' : '折叠'"
                :icon="collapse ? 'el-icon-full-screen' : 'el-icon-minus'"
                @click="handleChangePanelFold"
              >
              </el-button>
              <el-button @click="handleClosePanel" type="text" title="关闭" icon="el-icon-close"> </el-button>
            </div>
          </div>
					<!-- 正在上传的文件列表 -->
          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length"><i class="icon-empty-file"></i> 暂无待上传文件</div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import SparkMD5 from 'spark-md5'

export default {
  data() {
    return {
			// 上传组件配置项
      options: {
        target: 'api/filetransfer/uploadfile', // 上传文件-目标 URL
        chunkSize: 1024 * 1024, //  每个分片的大小
        fileParameterName: 'file', //  上传文件时文件的参数名，默认 file
        maxChunkRetries: 3, //  并发上传数，默认 3
        testChunks: true, //  是否开启分片已存在于服务器的校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = JSON.parse(message)
          let data = objMessage.data
          if (data.skipUpload) {
						// 分片已存在于服务器中
            return true
          }
          return (data.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          token: this.getCookies('token')
        },
        query() {}
      },
      attrs: {
        accept: '*'
      },
      panelShow: false, //  上传文件面板是否显示
      collapse: false	//	上传文件面板是否折叠
    }
  },
	computed: {
    // Uploader	上传组件实例
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  mounted() {
    this.$EventBus.$on('openUploader', (query) => {
      this.params = query || {}
      // this.$refs.uploadBtn.click()
      var e = document.createEvent('MouseEvent')
      e.initEvent('click', false, false)
      this.$refs.uploadBtn.$el.dispatchEvent(e)
    })
  },
	destroyed() {
    this.$off('openUploader')
  },
  methods: {
    /**
		 * 添加文件的回调函数
		 * @param {object} file 文件信息
		 */
    handleFileAdded(file) {
      this.panelShow = true
      this.computeMD5(file)
    },
		/**
     * 文件上传过程 回调函数
     * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
     * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {object} chunk Uploader.Chunk 实例，它就是该文件的最后一个块实例，如果你想得到请求响应码的话，chunk.xhr.status 就是
     */
    handleFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    /**
     * 文件上传成功 回调函数
		 * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
		 * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {string} response 服务端响应内容，永远都是字符串
     */
    handleFileSuccess(rootFile, file, response) {
      if (response == '') {
        this.statusSet(file.id, 'failed')
        return
      }

      let result = JSON.parse(response)
      if (result.success) {
        this.$message.success(`${file.name} - 上传完毕`)

        this.statusRemove(file.id)
        this.$EventBus.$emit('refreshList', '')
        this.$EventBus.$emit('refreshStorage', '')
      } else {
        this.$message.error(result.message)
        this.statusSet(file.id, 'failed')
      }
    },
		/**
     * 文件上传失败 回调函数
		 * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
		 * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {string} response 服务端响应内容，永远都是字符串
     */
    handleFileError(rootFile, file, response) {
      this.$message({
        message: response,
        type: 'error'
      })
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param {object} file 文件信息
     */
    computeMD5(file) {
      let fileReader = new FileReader()
      let time = new Date().getTime()
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 1 * 1024 * 1024
      let chunks = Math.ceil(file.size / chunkSize)
      let spark = new SparkMD5.ArrayBuffer()
      // 文件状态设为"计算MD5"
      this.statusSet(file.id, 'md5')
      file.pause()
      loadNext()
      fileReader.onload = (e) => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%')
          })
        } else {
          let md5 = spark.end()
          this.calculateFileMD5End(md5, file)
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() -
              time} ms`
          )
        }
      }
      fileReader.onerror = function() {
				this.$notify({
					title: '错误',
					message: `文件${file.name}读取出错，请检查该文件`,
					type: 'error',
					duration: 2000
				})
        file.cancel()
      }
      function loadNext() {
        let start = currentChunk * chunkSize
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
		/**
		 * 文件MD5计算结束
		 * @param {string} md5 文件 MD5 值
		 * @param {object} file 文件对象
		 */
    calculateFileMD5End(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    },
		/**
		 * 改变上传面板折叠状态
		 */
    handleChangePanelFold() {
      let $list = $('#global-uploader .file-list')
      if ($list.is(':visible')) {
        $list.slideUp()
        this.collapse = true
      } else {
        $list.slideDown()
        this.collapse = false
      }
    },
		/**
		 * 关闭上传面板，并停止上传
		 */
    handleClosePanel() {
      this.uploader.cancel()
      this.panelShow = false
    },
    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      const statusMap = {
        md5: {
          text: '校验MD5',
          bgc: '#fff'
        },
        merging: {
          text: '合并中',
          bgc: '#e2eeff'
        },
        transcoding: {
          text: '转码中',
          bgc: '#e2eeff'
        },
        failed: {
          text: '上传失败',
          bgc: '#e2eeff'
        }
      }
      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`)
          .appendTo(`.file_${id} .uploader-file-status`)
          .css({
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            zIndex: '1',
            backgroundColor: statusMap[status].bgc
          })
          .text(statusMap[status].text)
      })
    },
		/**
		 * 移除自定义状态
		 */
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#global-uploader {
  position: fixed;
  z-index: 20;
  right: 15px;
  bottom: 15px;

  .uploader-app {
    width: 520px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      .title-span {
        padding-left: 0;
        margin-bottom: 0;
        font-size: 17px;
        color: #303133;
      }

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;

      > li {
        background-color: #fff;
      }
    }

    &.collapse {
      .file-title {
        background-color: #E7ECF2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/.uploader-file-icon {
    &:before {
      content: '' !important;
    }

    &[icon=image] {
      background: url('/assets/images/file/file_pic.png');
    }

    &[icon=video] {
      background: url('/assets/images/file/file_video.png');
    }

    &[icon=document] {
      background: url('/assets/images/file/file_txt.png');
    }
  }

  /deep/.uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
.select-file-btn {
  display: none;
}
</style>
