<template>
  <div class="operation-menu-wrapper" :class="'file-type-' + fileType">
    <el-button-group class="operate-group">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-upload2"
        id="uploadFileId"
        @click="handleUploadFileBtnClick()"
        v-if="fileType !== 6"
        >上传文件</el-button
      >
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="handleAddFolderBtnClick()"
        v-if="!fileType && fileType !== 6"
        >新建文件夹</el-button
      >
      <el-button
        size="mini"
        type="primary"
        :disabled="!selectionFile.length"
        icon="el-icon-delete"
        @click="handleBatchDeleteBtnClick()"
        >批量删除</el-button
      >
      <el-button
        size="mini"
        type="primary"
        :disabled="!selectionFile.length"
        icon="el-icon-rank"
        @click="handleBatchMoveBtnClick()"
        v-if="!fileType && fileType !== 6"
        >批量移动</el-button
      >
      <el-button
        size="mini"
        type="primary"
        :disabled="!selectionFile.length"
        icon="el-icon-download"
        @click="handleBatchDownloadBtnClick()"
        v-if="fileType !== 6"
        >批量下载</el-button
      >
    </el-button-group>

    <!-- 批量操作 -->
    <el-button
      class="batch-opera-btn"
      :type="batchOperate ? 'primary' : ''"
      icon="el-icon-finished"
      size="mini"
      v-if="fileModel === 1"
      @click="handleBatchOperationChange()"
    >
      {{ batchOperate ? '取消批量操作' : '批量操作' }}
    </el-button>
    <!-- 文件展示模式 -->
    <div class="change-file-model">
      <el-radio-group v-model="fileGroupLable" size="mini" @change="handleFileDisplayModelChange">
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
import { batchDeleteFile, createFold, batchDeleteRecoveryFile } from '@/request/file.js'
import SelectColumn from './SelectColumn'

export default {
  name: 'OperationMenu',
  props: {
    // 文件类型
    fileType: {
      required: true,
      type: Number
    },
    // 文件路径
    filePath: {
      required: true,
      type: String
    },
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
      fileGroupLable: 0 //  文件展示模式
    }
  },
  computed: {
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
    // 文件查看模式 0 列表模式 1 网格模式 2 时间线模式
    fileModel() {
      return this.$store.getters.fileModel
    }
  },
  watch: {
    fileType(newValue, oldValue) {
      if (oldValue === 1 && this.fileModel === 2) {
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
    /**
     * 上传文件按钮点击事件
     * @description 通过Bus通信，开启全局上传文件流程
     */
    handleUploadFileBtnClick() {
      this.$EventBus.$emit('openUploader', this.uploadFileData)
    },
    /**
     * 新建文件夹按钮点击事件
     * @description 打开对话框，让用户输入文件夹名称
     */
    handleAddFolderBtnClick() {
      this.$prompt('请输入文件夹名称', '创建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.confirmCreateFile(value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    /**
     * 新建文件夹对话框 | 确定按钮点击事件
     * @description 调用新建文件夹接口
     * @param {string} fileName 文件夹名称
     */
    confirmCreateFile(fileName) {
      let data = {
        fileName: fileName,
        filePath: this.filePath,
        isDir: 1
      }
      createFold(data).then((res) => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('getTableDataByType')
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    /**
     * 批量删除按钮点击事件
     * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
     */
    handleBatchDeleteBtnClick() {
      if (this.fileType === 6) {
        //  回收站里 - 彻底删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmBatchDeleteFile(true)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        //  非回收站
        this.$confirm('删除后可在回收站查看, 是否继续删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmBatchDeleteFile(false)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    /**
     * 批量删除文件对话框 | 确定按钮点击事件
     * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
     * @param {boolean} type 文件类型，true 在回收站中彻底删除 false 删除到回收站
     */
    confirmBatchDeleteFile(type) {
      if (type) {
        //  回收站中删除
        batchDeleteRecoveryFile({
          recoveryFileIds: JSON.stringify(this.selectionFile)
        }).then((res) => {
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
      } else {
        //  非回收站删除
        batchDeleteFile({
          files: JSON.stringify(this.selectionFile)
        }).then((res) => {
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
      }
    },
    /**
     * 批量移动按钮点击事件
     */
    handleBatchMoveBtnClick() {
      /**
       * 第一个参数 是否批量移动
       * 第二个参数 打开/关闭移动文件对话框
       */
      this.$emit('setMoveFileDialogData', true, true)
    },
    /**
     * 批量下载按钮点击事件
     */
    handleBatchDownloadBtnClick() {
      for (let i = 0; i < this.selectionFile.length; i++) {
        let name = 'downloadLink' + i
        this.$refs[name][0].click()
      }
    },
    /**
     * 网格模式下，批量操作状态切换
     */
    handleBatchOperationChange() {
      this.$emit('update:batchOperate', !this.batchOperate)
    },
    /**
     * 文件查看模式切换
     * @param {number} label 0 列表 1 网格 2 时间线
     */
    handleFileDisplayModelChange(label) {
      this.$store.commit('changeFileModel', label)
    }
  }
}
</script>

<style lang="stylus" scoped>
.operation-menu-wrapper.file-type-6 {
  margin: 8px 0;
  justify-content: flex-end;
}

.operation-menu-wrapper {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .operate-group {
    flex: 1;
  }

  .change-image-model, .change-file-model {
    margin-right: 8px;
  }

  .batch-opera-btn {
    margin-right: 8px;
  }
}
</style>
