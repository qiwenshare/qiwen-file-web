<template>
  <div class="share-wrapper">
    <div class="share-file-wrapper" v-if="shareStep === 3">
      <div class="operation-wrapper">
        <!-- 面包屑导航栏 -->
        <BreadCrumb class="breadcrumb" :fileType="7"></BreadCrumb>
        <el-button type="primary" size="mini" icon="el-icon-takeaway-box" @click="handleSaveBtnClick"
          >保存到网盘</el-button
        >
      </div>
      <!-- 文件列表-表格模式 -->
      <FileTable
        ref="fileTableInstance"
        :fileType="7"
        :filePath="filePath"
        :fileList="fileList"
        :loading="loading"
        @setSelectionFile="setSelectionFile"
      ></FileTable>
    </div>
    <!-- 文件分享对话框 -->
    <el-dialog
      title="文件分享"
      :visible.sync="dialogShareFile.visible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <div class="end-time" v-if="shareStep === 1">此分享链接已过期</div>
      <el-form
        class="extraction-code-form"
        v-if="shareStep === 2"
        ref="codeForm"
        :model="dialogShareFile.codeForm"
        :rules="dialogShareFile.codeFormRules"
        label-width="80px"
      >
        <el-form-item label="提取码" prop="extractionCode">
          <el-input v-model="dialogShareFile.codeForm.extractionCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="shareStep === 1" @click="handleCloseBtnClick()">关 闭</el-button>
        <el-button v-else type="primary" @click="handleSubmitBtnClick('codeForm')">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 保存到网盘 路径选择对话框 -->
    <MoveFileDialog
      :dialogData="dialogSelectPath"
      @setSelectFilePath="setSelectFilePath"
      @confirmDialog="confirmSelectPathDialog"
      @setDialogData="setSelectPathDialogData"
    ></MoveFileDialog>
  </div>
</template>

<script>
import BreadCrumb from '_c/BreadCrumb'
import FileTable from '_c/File/FileTable'
import MoveFileDialog from '_c/File/MoveFileDialog'
import {
  checkShareLinkEndtime,
  checkShareLinkType,
  checkShareLinkCode,
  getShareFileList,
  saveShareFile
} from '_r/file.js'

export default {
  name: 'Share',
  components: {
    BreadCrumb,
    FileTable,
    MoveFileDialog
  },
  data() {
    return {
      // 文件分享对话框数据
      dialogShareFile: {
        visible: false,
        codeForm: {
          extractionCode: ''
        },
        codeFormRules: {
          extractionCode: [
            {
              required: true,
              message: '请输入提取码',
              trigger: 'blur'
            }
          ]
        }
      },
      shareStep: 0,
      fileList: [],
      loading: false,
      // 保存到网盘对话框数据
      dialogSelectPath: {
        visible: false //  是否可见
      },
      selectFilePath: '', //  保存到网盘的目标路径
      selectionFile: [] //  表格勾选的文件列表
    }
  },
  computed: {
    shareBatchNum() {
      return this.$route.params.shareBatchNum
    },
    filePath() {
      return this.$route.query.filePath
    },
    shareFilePath() {
      return this.$route.query.filePath
    }
  },
  watch: {
    filePath() {
      this.getShareList()
    }
  },
  created() {
    if (!this.filePath) {
      this.$router.replace({
        query: {
          filePath: '/'
        }
      })
    }
  },
  mounted() {
    this.checkEndTime()
  },
  methods: {
    /**
     * 表格勾选框事件 | 保存被勾选的文件
     * @param {object[]} selection 被勾选的文件数组
     */
    setSelectionFile(selection) {
      this.selectionFile = selection
    },
    /**
     * 校验分享链接过期时间
     */
    checkEndTime() {
      checkShareLinkEndtime({
        shareBatchNum: this.shareBatchNum
      }).then((res) => {
        if (res.success) {
          if (this.getCookies(`share_${this.shareBatchNum}`) === 'true') {
            this.checkShareComplete()
          } else {
            this.dialogShareFile.visible = true
            this.checkShareType()
          }
        } else {
          this.dialogShareFile.visible = true
          this.shareStep = 1 //  链接已过期
        }
      })
    },
    /**
     * 校验分享类型
     * @description 校验分享链接是公共还是私密
     */
    checkShareType() {
      checkShareLinkType({
        shareBatchNum: this.shareBatchNum
      }).then((res) => {
        if (res.success) {
          // 0 公共 1 私密
          if (res.data.shareType === 0) {
            this.shareStep = 3 //  不是私密链接，直接展示文件列表
            this.getShareList()
            this.dialogShareFile.visible = false
          }
          if (res.data.shareType === 1) {
            this.shareStep = 2 //  是私密链接时，让用户输入提取码
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 分享文件验证对话框 取消按钮
     */
    handleCloseBtnClick() {
      this.dialogShareFile.visible = false
      this.$router.push({ name: 'File', query: { fileType: 0, filePath: '/' } })
    },
    /**
     * 提交按钮点击事件
     */
    handleSubmitBtnClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          checkShareLinkCode({
            extractionCode: this.dialogShareFile.codeForm.extractionCode,
            shareBatchNum: this.shareBatchNum
          }).then((res) => {
            if (res.success) {
              this.setCookies(`share_${this.shareBatchNum}`, true)
              this.$refs[formName].resetFields() //  清空表单
              this.checkShareComplete()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 校验全部通过
     */
    checkShareComplete() {
      this.shareStep = 3 //  展示文件列表
      this.dialogShareFile.visible = false
      this.getShareList()
    },
    /**
     * 获取分享文件列表
     */
    getShareList() {
      this.loading = true
      getShareFileList({
        shareFilePath: this.shareFilePath,
        shareBatchNum: this.shareBatchNum
      }).then((res) => {
        if (res.success) {
          this.fileList = res.data
          this.loading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 保存到网盘按钮点击事件
     */
    handleSaveBtnClick() {
      if (this.selectionFile.length) {
        this.dialogSelectPath.visible = true
      } else {
        this.$message.warning('请先勾选要保存的文件')
      }
    },
    /**
     * 移动文件模态框 | 设置移动后的文件路径
     * @param {string} selectFilePath 目标文件夹路径
     */
    setSelectFilePath(selectFilePath) {
      this.selectFilePath = selectFilePath
    },
    /**
     * 移动文件模态框 | 确定按钮事件
     */
    confirmSelectPathDialog() {
      saveShareFile({
        filePath: this.selectFilePath,
        files: JSON.stringify(
          this.selectionFile.map((item) => {
            return {
              userFileId: item.userFileId
            }
          })
        )
      }).then((res) => {
        if (res.success) {
          this.$message.success('保存成功')
          this.dialogSelectPath.visible = false
          this.$refs.fileTableInstance.clearSelectedTable() //  清空表格已选项
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 设置移动文件模态框相关数据
     * @param {boolean} isBatchMove 是否批量移动，为 null时是确认移动，值由之前的值而定，在此业务中此致无用
     * @param {boolean} visible 移动文件对话框状态
     */
    setSelectPathDialogData(isBatchMove, visible) {
      this.dialogSelectPath.visible = visible
    }
  }
}
</script>

<style lang="stylus" scoped>
.share-wrapper {
  .share-file-wrapper {
    width: 100%;

    .operation-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
  }
}
</style>
