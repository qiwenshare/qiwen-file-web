<template>
  <div class="operation-menu-wrapper" :class="'file-type-' + fileType">
    <el-button-group class="operate-group" v-if="fileType !== 6">
      <el-button size="mini" type="primary" icon="el-icon-upload2" id="uploadFileId" @click="upload()">上传</el-button>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFolder()" v-if="!fileType">新建文件夹</el-button>
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-rank" @click="moveSelectedFile()" v-if="!fileType">移动</el-button>
      <!-- <el-button size="mini" icon="el-icon-document-copy">拷贝</el-button> -->
      <el-button size="mini" type="primary" :disabled="!selectionFile.length" icon="el-icon-download" @click="downloadSelectedFile()">下载</el-button>
    </el-button-group>

    <!-- 批量操作 -->
    <el-button
      class="batch-opera-btn"
      :type="batchOperate ? 'primary' : ''"
      icon="el-icon-finished"
      size="mini"
      v-if="fileModel === 1"
      @click="changeBatchOperate()"
    >
      {{ batchOperate ? '取消批量操作' : '批量操作' }}
    </el-button>
    <!-- 文件展示模式 -->
    <div class="change-file-model">
      <el-radio-group v-model="fileGroupLable" size="mini" @change="changeFileDisplayModel">
        <el-radio-button :label="0"> <i class="el-icon-tickets"></i> 列表 </el-radio-button>
        <el-radio-button :label="1"> <i class="el-icon-s-grid"></i> 网格 </el-radio-button>
        <el-radio-button :label="2" v-if="fileType === 1"> <i class="el-icon-date"></i> 时间线 </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 选择表格列 -->
    <SelectColumn class="select-column"></SelectColumn>

    <!-- 多选文件下载，页面隐藏 -->
    <a
      target="_blank"
      v-for="(item, index) in selectionFile"
      :key="index"
      :href="'api' + item.fileUrl"
      :download="item.fileName + '.' + item.extendName"
      :title="'downloadLink' + index"
      :ref="'downloadLink' + index"
    ></a>
  </div>
</template>

<script>
import {
  batchDeleteFile,
  createFile
} from '@/request/file.js'
import SelectColumn from './SelectColumn'

export default {
  name: 'OperationMenu',
  props: {
    selectionFile: Array,
    operationFile: Object,
    batchOperate: Boolean
  },
  components: {
    SelectColumn
  },
  data() {
    return {
      fileTree: [],
      batchDeleteFileDialog: false,
      fileGroupLable: 0, //  文件展示模式
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
    },
    // 文件查看模式 0列表模式 1网格模式 2 时间线模式
    fileModel() {
      return this.$store.getters.fileModel
    }
  },
  watch: {
    fileType(newValue, oldValue) {
      if(oldValue === 1 && this.fileModel === 2) {
        this.$store.commit('changeFileModel', 0)
        this.fileGroupLable = 0
      }
    }
  },
  mounted() {
    this.fileGroupLable = this.fileModel
    this.$EventBus.$on('refreshList', () => {
      this.$emit('getTableDataByType')
    })
    this.$EventBus.$on('refreshStorage', () => {
      this.$store.dispatch('showStorage')
    })
  },
  methods: {
    upload() {
      // 打开文件选择框
      this.$EventBus.$emit('openUploader', this.uploadFileData)
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
      createFile(data).then((res) => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('getTableDataByType')
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    //  批量操作-删除按钮
    deleteSelectedFile() {
      let data = {
        files: JSON.stringify(this.selectionFile)
      }
      //  批量删除接口
      batchDeleteFile(data).then((res) => {
        if (res.success) {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.$emit('getTableDataByType')
          this.$store.dispatch('showStorage')
        } else {
          this.$message.error('失败' + res.message)
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

    // 图片网格模式下 - 批量操作切换
    changeBatchOperate() {
      this.$emit('update:batchOperate', !this.batchOperate)
    },
    // 切换文件查看模式
    changeFileDisplayModel(label) {
      this.$store.commit('changeFileModel', label)
    }
  }
}
</script>

<style lang="stylus" scoped>
.operation-menu-wrapper.file-type-6
  margin 8px 0
  justify-content flex-end
.operation-menu-wrapper
  padding 16px 0
  display flex
  justify-content space-between
  align-items: center;
  .operate-group
    flex 1
  .change-image-model,
  .change-file-model
    margin-right 8px
  .batch-opera-btn
    margin-right 8px
</style>
