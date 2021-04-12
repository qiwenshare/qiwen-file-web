<template>
  <div id="global-uploader">
    <!-- 上传文件组件 -->
    <uploader
      class="uploader-app"
      ref="uploader"
      :options="options"
      :autoStart="false"
      :fileStatusText="fileStatusText"
      @file-added="handleFileAdded"
      @file-success="handleFileSuccess"
      @file-error="handleFileError"
    >
      <uploader-unsupport></uploader-unsupport>
      <!-- 选择按钮 在这里隐藏 -->
      <uploader-btn class="select-file-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>
      <!-- 拖拽上传 -->
      <uploader-drop class="drop-box" v-show="dropBoxShow">
        <span class="text"> 将文件拖拽到此区域 </span>
        <i class="close-icon el-icon-circle-close" @click="dropBoxShow = false">关闭</i>
      </uploader-drop>
      <!-- 上传列表 -->
      <uploader-list v-show="panelShow">
        <template v-slot:default="props">
          <div class="file-panel">
            <div class="file-title">
              <span class="title-span">
                上传列表<span class="count">（{{ props.fileList.length }}）</span>
              </span>
              <div class="operate">
                <el-button
                  type="text"
                  :title="collapse ? '展开' : '折叠'"
                  :icon="collapse ? 'el-icon-full-screen' : 'el-icon-minus'"
                  @click="collapse ? (collapse = false) : (collapse = true)"
                >
                </el-button>
                <el-button @click="handleClosePanel" type="text" title="关闭" icon="el-icon-close"> </el-button>
              </div>
            </div>
            <!-- 正在上传的文件列表 -->
            <el-collapse-transition>
              <ul class="file-list" v-show="!collapse">
                <li
                  class="file-item"
                  :class="{ 'custom-status-item': file.statusStr !== '' }"
                  v-for="file in props.fileList"
                  :key="file.id"
                >
                  <uploader-file ref="fileItem" :file="file" :list="true"></uploader-file>
                  <!-- 自定义状态 -->
                  <span class="custom-status">{{ file.statusStr }}</span>
                </li>
                <div class="no-file" v-if="!props.fileList.length"><i class="icon-empty-file"></i> 暂无待上传文件</div>
              </ul>
            </el-collapse-transition>
          </div>
        </template>
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
      fileStatusText: {
        success: '上传成功',
        error: 'error',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      attrs: {
        accept: '*'
      },
      panelShow: false, //  上传文件面板是否显示
      collapse: false, //	上传文件面板是否折叠
      dropBoxShow: false //  拖拽上传是否显示
    }
  },
  computed: {
    // Uploader	上传组件实例
    uploaderInstance() {
      return this.$refs.uploader.uploader
    }
  },
  mounted() {
    this.$EventBus.$on('openUploader', (query, type) => {
      this.options.headers.token = this.getCookies('token')
      this.params = query || {}
      if (type) {
        this.$refs.uploadBtn.$el.click()
      } else {
        this.dropBoxShow = true
      }
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
      this.dropBoxShow = false
      this.panelShow = true
      this.collapse = false
      this.computeMD5(file)
    },
    /**
     * 文件上传成功 回调函数
     * @param {object} rootFile 成功上传的文件所属的根 Uploader.File 对象，它应该包含或者等于成功上传文件
     * @param {object} file 当前成功的 Uploader.File 对象本身
     * @param {string} response 服务端响应内容，永远都是字符串
     */
    handleFileSuccess(rootFile, file, response) {
      if (response == '') {
        file.statusStr = '上传失败'
        return
      }

      let result = JSON.parse(response)
      if (result.success) {
        this.$message.success(`${file.name} - 上传完毕`)
        file.statusStr = ''
        setTimeout(() => {
          this.collapse = true //  折叠上传列表
        }, 1500)
        this.$EventBus.$emit('refreshList', '')
        this.$EventBus.$emit('refreshStorage', '')
      } else {
        this.$message.error(result.message)
        file.statusStr = '上传失败'
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
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 1 * 1024 * 1024
      let chunks = Math.ceil(file.size / chunkSize)
      let spark = new SparkMD5.ArrayBuffer()
      // 文件状态设为"计算MD5"
      file.statusStr = '计算MD5'
      file.pause()
      loadNext()
      fileReader.onload = (e) => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          file.statusStr = `校验MD5 ${((currentChunk / chunks) * 100).toFixed(0)}%`
        } else {
          let md5 = spark.end()
          this.calculateFileMD5End(md5, file)
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
      Object.assign(this.uploaderInstance.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      // 移除自定义状态
      file.statusStr = ''
    },
    /**
     * 关闭上传面板，并停止上传
     */
    handleClosePanel() {
      this.uploaderInstance.cancel()
      this.panelShow = false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

#global-uploader {
  position: fixed;
  z-index: 20;
  right: 15px;
  bottom: 15px;

  .drop-box {
    position: fixed;
    z-index: 19;
    top: 0;
    left: 0;
    border: 5px dashed #8091a5 !important;
    background: #fff;
    opacity: 0.85;
    color: #8091a5 !important;
    text-align: center;
    box-sizing: border-box;
    height: 100%;
    line-height: 100%;
    width: 100%;

    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      font-size: 30px;
    }

    .close-icon {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
    }
  }

  .uploader-app {
    width: 560px;
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
        font-size: 16px;

        .count {
          color: $SecondaryText;
        }
      }

      .operate {
        flex: 1;
        text-align: right;

        >>> .el-button--text {
          color: $PrimaryText;

          i[class^=el-icon-] {
            font-weight: 600;
          }

          &:hover {
            .el-icon-full-screen, .el-icon-minus {
              color: $Success;
            }

            .el-icon-close {
              color: $Danger;
            }
          }
        }
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      font-size: 12px;
      setScrollbar(8px, #EBEEF5, #C0C4CC);

      .file-item {
        position: relative;
        background-color: #fff;

        >>> .uploader-file {
          height: 40px;
          line-height: 40px;

          .uploader-file-progress {
            border: 1px solid $Success;
            border-right: none;
            border-left: none;
            background: #e1f3d8;
          }

          .uploader-file-name {
            width: 44%;
          }

          .uploader-file-size {
            width: 16%;
          }

          .uploader-file-meta {
            display: none;
          }

          .uploader-file-status {
            width: 30%;
            text-indent: 0;
          }

          .uploader-file-actions>span {
            margin-top: 12px;
          }
        }

        >>> .uploader-file[status='success'] {
          .uploader-file-progress {
            border: none;
          }
        }
      }

      .file-item.custom-status-item {
        >>> .uploader-file-status {
          visibility: hidden;
        }

        .custom-status {
          position: absolute;
          top: 0;
          right: 10%;
          width: 24%;
          height: 40px;
          line-height: 40px;
        }
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
    display: none;
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
