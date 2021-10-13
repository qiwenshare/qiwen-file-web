<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header>
      <OperationMenu
        :fileType="fileType"
        :filePath="filePath"
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        :batchOperate.sync="batchOperate"
        @getSearchFileList="getSearchFileList"
        @getTableDataByType="getTableDataByType"
        @setMoveFileDialogData="setMoveFileDialogData"
        @setShareFileDialogData="setShareFileDialogData"
      ></OperationMenu>
    </el-header>
    <div class="middle-wrapper">
      <!-- 面包屑导航栏 -->
      <BreadCrumb class="breadcrumb" :fileType="fileType"></BreadCrumb>
    </div>
    <!-- 文件列表-表格模式 -->
    <FileTable
      :fileType="fileType"
      :filePath="filePath"
      :fileList="fileList"
      :loading="loading"
      v-if="fileModel === 0"
      @setMoveFileDialogData="setMoveFileDialogData"
      @setShareFileDialogData="setShareFileDialogData"
      @setOperationFile="setOperationFile"
      @setSelectionFile="setSelectionFile"
      @getTableDataByType="getTableDataByType"
    ></FileTable>
    <!-- 文件列表-网格模式 -->
    <FileGrid
      :fileType="fileType"
      :filePath="filePath"
      :fileList="fileList"
      :loading="loading"
      :batchOperate="batchOperate"
      v-if="fileModel === 1"
      @setMoveFileDialogData="setMoveFileDialogData"
      @setShareFileDialogData="setShareFileDialogData"
      @setOperationFile="setOperationFile"
      @setSelectionFile="setSelectionFile"
      @getTableDataByType="getTableDataByType"
    ></FileGrid>
    <!-- 图片-时间线模式 -->
    <FileTimeLine class="image-model" v-if="fileModel === 2" :fileList="fileList"></FileTimeLine>
    <div class="pagination-wrapper">
      <div class="current-page-count">当前页{{ fileList.length }}条</div>
      <el-pagination
        :current-page="pageData.currentPage"
        :page-size="pageData.pageCount"
        :total="pageData.total"
        :page-sizes="[10, 50, 100, 200]"
        layout="sizes, total, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
    <!-- 移动文件模态框 -->
    <MoveFileDialog
      :dialogData="dialogMoveFile"
      @setSelectFilePath="setSelectFilePath"
      @confirmDialog="confirmMoveFile"
      @setDialogData="setMoveFileDialogData"
    ></MoveFileDialog>
    <!-- 分享文件模态框 -->
    <ShareFileDialog
      :dialogShareFile="dialogShareFile"
      @setDialogShareFileData="setDialogShareFileData"
    ></ShareFileDialog>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from '_c/BreadCrumb'
import FileTable from '_c/File/FileTable'
import FileGrid from './components/FileGrid'
import FileTimeLine from './components/FileTimeLine'
import MoveFileDialog from '_c/File/MoveFileDialog'
import ShareFileDialog from './components/ShareFileDialog'

import {
  getFileListByPath,
  getFileListByType,
  getRecoveryFile,
  moveFile,
  batchMoveFile,
  searchFile,
  shareFile
} from '_r/file.js'

export default {
  name: 'FileList',
  components: {
    OperationMenu,
    BreadCrumb,
    FileTable,
    FileGrid,
    FileTimeLine,
    MoveFileDialog,
    ShareFileDialog
  },
  data() {
    return {
      fileNameSearch: '',
      loading: true, //  表格数据-loading
      fileList: [], //  表格数据-文件列表
      pageData: {
        currentPage: 1,
        pageCount: 50,
        total: 0
      },
      //  移动文件模态框数据
      dialogMoveFile: {
        isBatchMove: false,
        visible: false //  是否可见
      },
      selectFilePath: '', //  移动文件路径
      operationFile: {}, // 当前操作行
      selectionFile: [], // 勾选的文件
      // 分享文件对话框数据
      dialogShareFile: {
        visible: false,
        loading: false,
        success: false,
        shareData: {}
      },
      //  可以识别的文件类型
      fileImgTypeList: [
        'png',
        'jpg',
        'jpeg',
        'docx',
        'doc',
        'ppt',
        'pptx',
        'xls',
        'xlsx',
        'avi',
        'mp4',
        'css',
        'csv',
        'chm',
        'rar',
        'zip',
        'dmg',
        'mp3',
        'open',
        'pdf',
        'rtf',
        'txt',
        'oa',
        'js',
        'html',
        'img',
        'sql',
        'jar',
        'svg',
        'gif',
        'json',
        'exe'
      ],
      //  文件图片Map映射
      fileImgMap: {
        dir: require('_a/images/file/dir.png'),
        chm: require('_a/images/file/file_chm.png'),
        css: require('_a/images/file/file_css.png'),
        csv: require('_a/images/file/file_csv.png'),
        png: require('_a/images/file/file_pic.png'),
        jpg: require('_a/images/file/file_pic.png'),
        jpeg: require('_a/images/file/file_pic.png'),
        docx: require('_a/images/file/file_word.png'),
        doc: require('_a/images/file/file_word.png'),
        ppt: require('_a/images/file/file_ppt.png'),
        pptx: require('_a/images/file/file_ppt.png'),
        xls: require('_a/images/file/file_excel.png'),
        xlsx: require('_a/images/file/file_excel.png'),
        mp4: require('_a/images/file/file_video.png'),
        avi: require('_a/images/file/file_avi.png'),
        rar: require('_a/images/file/file_rar.png'),
        zip: require('_a/images/file/file_zip.png'),
        dmg: require('_a/images/file/file_dmg.png'),
        mp3: require('_a/images/file/file_music.png'),
        open: require('_a/images/file/file_open.png'),
        pdf: require('_a/images/file/file_pdf.png'),
        rtf: require('_a/images/file/file_rtf.png'),
        txt: require('_a/images/file/file_txt.png'),
        oa: require('_a/images/file/file_oa.png'),
        unknown: require('_a/images/file/file_unknown.png'),
        js: require('_a/images/file/file_js.png'),
        html: require('_a/images/file/file_html.png'),
        img: require('_a/images/file/file_img.png'),
        sql: require('_a/images/file/file_sql.png'),
        jar: require('_a/images/file/file_jar.png'),
        svg: require('_a/images/file/file_svg.png'),
        gif: require('_a/images/file/file_gif.png'),
        json: require('_a/images/file/file_json.png'),
        exe: require('_a/images/file/file_exe.png')
      },
      batchOperate: false //  批量操作模式
    }
  },
  computed: {
    // 左侧菜单选中的文件类型
    fileType() {
      return this.$route.query.fileType ? Number(this.$route.query.fileType) : 0
    },
    // 当前所在路径
    filePath() {
      return this.$route.query.filePath ? this.$route.query.filePath : '/'
    },
    // 文件查看模式 0列表模式 1网格模式 2 时间线模式
    fileModel() {
      return this.$store.getters.fileModel
    }
  },
  watch: {
    filePath() {
      // 当左侧菜单选择全部，文件路径发生变化时，再重新获取文件列表
      if (this.$route.name === 'File' && this.fileType === 0) {
        this.setPageCount()
        this.getTableDataByType()
      }
    },
    fileType() {
      if (this.$route.name === 'File') {
        this.setPageCount()
        this.getTableDataByType()
      }
    },
    // 监听文件查看模式
    fileModel() {
      this.setPageCount()
      this.getTableDataByType()
    },
    batchOperate(value) {
      if (!value) {
        this.selectionFile = []
      }
    }
  },
  created() {
    this.setPageCount()
    this.getTableDataByType()
  },
  methods: {
    /**
     * 表格数据获取相关事件 | 调整分页大小
     */
    setPageCount() {
      this.pageData.currentPage = 1
      if (this.fileModel === 0) {
        this.pageData.pageCount = 50
      }
      if (this.fileModel === 1) {
        this.pageData.pageCount = 100
      }
    },
    /**
     * 表格数据获取相关事件 | 获取文件列表数据
     */
    getTableDataByType() {
      this.batchOperate = false
      this.loading = true
      // 分类型
      if (Number(this.fileType)) {
        if (Number(this.fileType) === 6) {
          this.shwoFileRecovery() //  回收站
        } else {
          this.showFileListByType()
        }
      } else {
        // 全部文件
        this.showFileList()
      }
      this.$store.dispatch('showStorage')
    },
    /**
     * 表格数据获取相关事件 | 获取当前路径下的文件列表
     */
    showFileList() {
      let data = {
        filePath: this.filePath,
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }
      getFileListByPath(data).then((res) => {
        if (res.success) {
          this.fileList = res.data.list
          this.pageData.total = res.data.total
          this.loading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 表格数据获取相关事件 | 分页组件 | 当前页码改变
     */
    handleCurrentChange(currentPage) {
      this.pageData.currentPage = currentPage
      this.getTableDataByType()
    },
    /**
     * 表格数据获取相关事件 | 分页组件 | 页大小改变时
     */
    handleSizeChange(pageCount) {
      this.pageData.pageCount = pageCount
      this.getTableDataByType()
    },
    /**
     * 表格数据获取相关事件 | 获取回收站文件列表
     */
    shwoFileRecovery() {
      getRecoveryFile().then((res) => {
        if (res.success) {
          this.fileList = res.data
          this.loading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 表格数据获取相关事件 | 根据文件类型展示文件列表
     */
    showFileListByType() {
      //  分类型
      let data = {
        fileType: this.fileType,
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }
      getFileListByType(data).then((res) => {
        if (res.success) {
          this.fileList = res.data.list
          this.pageData.total = res.data.total
          this.loading = false
        } else {
          this.$message.error(res.message)
        }
      })
    },

    /**
     * 表格勾选框事件 | 保存被勾选的文件
     * @param {object[]} selection 被勾选的文件数组
     */
    setSelectionFile(selection, batchOperate) {
      this.selectionFile = selection
      this.batchOperate = batchOperate
    },

    /**
     * 移动按钮相关事件 | 当前操作行
     * @param {object} operationFile
     */
    setOperationFile(operationFile) {
      this.operationFile = operationFile
    },
    /**
     * 移动按钮相关事件 | 设置移动文件模态框相关数据
     * @param {boolean} isBatchMove 是否批量移动，为 null时是确认移动，值由之前的值而定
     * @param {boolean} visible 移动文件对话框状态
     */
    setMoveFileDialogData(isBatchMove, visible) {
      this.dialogMoveFile.isBatchMove = isBatchMove ? isBatchMove : this.dialogMoveFile.isBatchMove
      this.dialogMoveFile.visible = visible
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
    confirmMoveFile() {
      if (this.dialogMoveFile.isBatchMove) {
        //  批量移动
        let data = {
          filePath: this.selectFilePath,
          files: JSON.stringify(this.selectionFile)
        }
        batchMoveFile(data).then((res) => {
          if (res.success) {
            this.$message.success(res.data)
            this.getTableDataByType()
            this.dialogMoveFile.visible = false
            this.selectionFile = []
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        //  单文件移动
        let data = {
          oldFilePath: this.operationFile.filePath,
          filePath: this.selectFilePath,
          fileName: this.operationFile.fileName,
          extendName: this.operationFile.extendName
        }
        moveFile(data).then((res) => {
          if (res.success) {
            this.$message.success('移动文件成功')
            this.getTableDataByType()
            this.dialogMoveFile.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    /**
     * 获取搜索文件结果列表
     * @param {string} fileName 文件名称
     */
    getSearchFileList(fileName) {
      this.loading = true
      searchFile({
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount,
        fileName: fileName
      }).then((res) => {
        this.loading = false
        if (res.success) {
          this.fileList = res.data.searchHits.map((item) => item.content)
          this.pageData.total = res.data.totalHits
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 设置分享文件对话框状态
     */
    setShareFileDialogData() {
      this.dialogShareFile.visible = true
    },
    /**
     * 分享文件对话框确定|取消按钮点击事件
     * @param {boolean} status 对话框状态
     * @param {object} data 分享文件数据
     */
    setDialogShareFileData(status, data) {
      if (status) {
        this.dialogShareFile.loading = true
        shareFile({
          ...data,
          remarks: '',
          files: JSON.stringify(
            this.selectionFile.map((item) => {
              return {
                userFileId: item.userFileId
              }
            })
          )
        }).then(
          (res) => {
            this.dialogShareFile.loading = false
            if (res.success) {
              this.dialogShareFile.success = true
              this.dialogShareFile.shareData = res.data
            } else {
              this.$message.error(res.message)
            }
          },
          (error) => {
            console.log(error)
            this.$message.error(error.message)
            this.dialogShareFile.loading = false
          }
        )
      } else {
        this.dialogShareFile.visible = false
        this.dialogShareFile.loading = false
        this.dialogShareFile.success = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.file-list-wrapper {
  >>> .el-header {
    padding: 0;
  }

  .middle-wrapper {
    margin-bottom: 8px;
  }

  .pagination-wrapper {
    position: relative;
    border-top: 1px solid $BorderBase;
    height: 44px;
    line-height: 44px;
    text-align: center;

    .current-page-count {
      position: absolute;
      left: 16px;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
      color: $RegularText;
    }
  }
}
</style>
