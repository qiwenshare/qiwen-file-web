<template>
  <div class="operation-menu-wrapper" :class="'file-type-' + fileType">
    <el-button-group class="operate-group">
      <el-dropdown class="drop-btn" trigger="hover" v-if="fileType === 0">
        <el-button size="mini" type="primary" icon="el-icon-upload2" id="uploadFileId"
          >上传文件<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleUploadFileBtnClick(true)">直接添加</el-dropdown-item>
          <el-dropdown-item @click.native="handleUploadFileBtnClick(false)">拖拽上传</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="dialogAddFolder.visible = true"
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

    <!-- 全局搜素文件 -->
    <el-input
      v-if="fileType === 0"
      class="select-file-input"
      v-model="searchFile.fileName"
      placeholder="搜索您的文件"
      size="mini"
      maxlength="255"
      :clearable="true"
      @change="handleSearchInputChange"
      @clear="$emit('getTableDataByType')"
      @keyup.enter.native="handleSearchInputChange(searchFile.fileName)"
    >
      <i slot="prefix" class="el-input__icon el-icon-search" title="点击搜索" @click="handleSearchClick"></i>
    </el-input>

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

    <!-- 新建文件夹对话框 -->
    <el-dialog
      title="新建文件夹"
      :visible.sync="dialogAddFolder.visible"
      :close-on-click-modal="false"
      width="550px"
      @close="handleAddFolderDialogCancel('addFolderForm')"
    >
      <el-form
        class="add-folder-form"
        :model="dialogAddFolder.form"
        :rules="dialogAddFolder.formRules"
        ref="addFolderForm"
        label-width="100px"
        label-position="top"
      >
        <el-form-item label="文件夹名称" prop="fileName">
          <el-input
            v-model="dialogAddFolder.form.fileName"
            placeholder="请输入文件夹名称"
            type="textarea"
            autosize
            maxlength="255"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddFolderDialogCancel('addFolderForm')">取 消</el-button>
        <el-button type="primary" :loading="dialogAddFolder.loading" @click="handleAddFolderDialogOk('addFolderForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

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
      // 文件搜索数据
      searchFile: {
        fileName: ''
      },
      // 新建文件夹对话框数据
      dialogAddFolder: {
        visible: false,
        form: {
          fileName: ''
        },
        formRules: {
          fileName: [{ required: true, message: '请输入文件夹名称', trigger: 'blur' }]
        },
        loading: false
      },
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
     * @param {boolean} type 上传方式 true 直接上传  false 拖拽上传
     */
    handleUploadFileBtnClick(type) {
      this.$EventBus.$emit('openUploader', this.uploadFileData, type)
    },
    /**
     * 新建文件夹对话框 | 取消按钮点击事件
     * @description 关闭对话框，重置表单
     * @param {string} formName 表单ref值
     */
    handleAddFolderDialogCancel(formName) {
      this.dialogAddFolder.visible = false
      this.$refs[formName].resetFields()
    },
    /**
     * 新建文件夹对话框 | 确定按钮点击事件
     * @description 校验表单，校验通过后调用新建文件夹接口
     * @param {string} formName 表单ref值
     */
    handleAddFolderDialogOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogAddFolder.loading = true
          let data = {
            fileName: this.dialogAddFolder.form.fileName,
            filePath: this.filePath,
            isDir: 1
          }
          createFold(data).then((res) => {
            this.dialogAddFolder.loading = false
            if (res.success) {
              this.$message.success('添加成功')
              this.dialogAddFolder.visible = false
              this.$refs[formName].resetFields()
              this.$emit('getTableDataByType')
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          return false
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
    handleSearchInputChange(value) {
      if (value === '') {
        this.$emit('getTableDataByType')
      } else {
        this.$emit('getSearchFileList', value)
      }
    },
    /**
     * 搜索框图标点击事件
     */
    handleSearchClick() {
      this.$emit('getSearchFileList', this.searchFile.fileName)
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
@import '~@/assets/styles/varibles.styl';

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

    .drop-btn {
      float: left;
      border-radius: 4px 0 0 4px;

      >>> .el-button {
        border-radius: 4px 0 0 4px;
      }
    }
  }

  .select-file-input {
    margin-right: 8px;
    width: 200px;

    .el-icon-search {
      cursor: pointer;
      font-size: 16px;

      &:hover {
        color: $Primary;
      }
    }
  }

  .change-image-model, .change-file-model {
    margin-right: 8px;
  }

  .batch-opera-btn {
    margin-right: 8px;
  }
}
</style>
