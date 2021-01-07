<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header class="file-list-header" v-if="fileType !== 6">
      <OperationMenu
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        :filePath="filePath"
        @getTableDataByType="getTableDataByType"
        @setMoveFileDialogData="setMoveFileDialogData"
      ></OperationMenu>
    </el-header>
    <div class="middle-wrapper" :class="'file-type-' + fileType">
      <!-- 面包屑导航栏 -->
      <BreadCrumb class="breadcrumb"></BreadCrumb>
      <!-- 图片展示模式 -->
      <div class="change-image-model" v-show="fileType === 1">
        <el-radio-group v-model="imageGroupLable" size="mini" @change="changeImageDisplayModel">
          <el-radio-button :label="0">
            <i class="el-icon-tickets"></i> 列表
          </el-radio-button>
          <el-radio-button :label="1">
            <i class="el-icon-s-grid"></i> 网格
          </el-radio-button>
          <el-radio-button :label="2">
            <i class="el-icon-date"></i> 时间线
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="change-file-model" v-show="fileType !== 1">
        <el-radio-group v-model="fileGroupLable" size="mini" @change="changeFileDisplayModel">
          <el-radio-button :label="0">
            <i class="el-icon-tickets"></i> 列表
          </el-radio-button>
          <el-radio-button :label="1">
            <i class="el-icon-s-grid"></i> 网格
          </el-radio-button>
        </el-radio-group>
      </div>
      <!-- 选择表格列 -->
      <SelectColumn class="select-column"></SelectColumn>
    </div>
    <!-- 文件列表-表格模式 -->
    <FileTable
      :fileList="fileList"
      :loading="loading"
      v-if="fileModel === 0 && fileType !== 1 || fileType === 1 && !imageModel"
      @setMoveFileDialogData="setMoveFileDialogData"
      @setOperationFile="setOperationFile"
      @setSelectionFile="setSelectionFile"
      @getTableDataByType="getTableDataByType"
    ></FileTable>
    <!-- 文件列表-网格模式 -->
    <FileGrid
      :fileList="fileList"
      :loading="loading"
      v-if="fileModel === 1 && fileType !== 1"
      @setMoveFileDialogData="setMoveFileDialogData"
      @setOperationFile="setOperationFile"
      @setSelectionFile="setSelectionFile"
      @getTableDataByType="getTableDataByType"
    ></FileGrid>
    <el-pagination
      v-if="fileType === 0"
      :current-page="pageData.currentPage"
      :page-size="pageData.pageCount"
      :total="pageData.total"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 图片网格模式 -->
    <ImageModel
      class="image-model"
      v-if="imageModel && fileType === 1"
      :fileList="fileList"
    ></ImageModel>
    <!-- 移动文件模态框 -->
    <MoveFileDialog
      :dialogMoveFile="dialogMoveFile"
      @setSelectFilePath="setSelectFilePath"
      @confirmMoveFile="confirmMoveFile"
      @setMoveFileDialogData="setMoveFileDialogData"
    ></MoveFileDialog>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from './components/BreadCrumb'
import SelectColumn from './components/SelectColumn'
import FileTable from './components/FileTable'
import FileGrid from './components/FileGrid'
import ImageModel from './components/ImageModel'
import MoveFileDialog from './components/MoveFileDialog'

import {
  getfilelist,
  selectFileByFileType,
  getRecoveryFile,
  getFileTree,
  moveFile,
  batchMoveFile
} from '@/request/file.js'

import infiniteScroll from "vue-infinite-scroll";
import Vue from 'vue'
Vue.use(infiniteScroll);


export default {
  name: 'FileList',
  components: {
    OperationMenu,
    BreadCrumb,
    SelectColumn,
    FileTable,
    FileGrid,
    ImageModel,
    MoveFileDialog
  },
  data() {
    return {
      fileNameSearch: '',
      loading: true, //  表格数据-loading
      fileList: [], //  表格数据-文件列表
      pageData: {
        currentPage: 1,
        pageCount: 10,
        total: 0
      },
      //  移动文件模态框数据
      dialogMoveFile: {
        isBatchMove: false,
        visible: false, //  是否可见
        fileTree: [] //  目录树
      },
      selectFilePath: '', //  移动文件路径
      operationFile: {}, // 当前操作行
      selectionFile: [], // 勾选的文件
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
        dir: require('@/assets/images/file/dir.png'),
        chm: require('@/assets/images/file/file_chm.png'),
        css: require('@/assets/images/file/file_css.png'),
        csv: require('@/assets/images/file/file_csv.png'),
        png: require('@/assets/images/file/file_pic.png'),
        jpg: require('@/assets/images/file/file_pic.png'),
        jpeg: require('@/assets/images/file/file_pic.png'),
        docx: require('@/assets/images/file/file_word.png'),
        doc: require('@/assets/images/file/file_word.png'),
        ppt: require('@/assets/images/file/file_ppt.png'),
        pptx: require('@/assets/images/file/file_ppt.png'),
        xls: require('@/assets/images/file/file_excel.png'),
        xlsx: require('@/assets/images/file/file_excel.png'),
        mp4: require('@/assets/images/file/file_video.png'),
        avi: require('@/assets/images/file/file_avi.png'),
        rar: require('@/assets/images/file/file_rar.png'),
        zip: require('@/assets/images/file/file_zip.png'),
        dmg: require('@/assets/images/file/file_dmg.png'),
        mp3: require('@/assets/images/file/file_music.png'),
        open: require('@/assets/images/file/file_open.png'),
        pdf: require('@/assets/images/file/file_pdf.png'),
        rtf: require('@/assets/images/file/file_rtf.png'),
        txt: require('@/assets/images/file/file_txt.png'),
        oa: require('@/assets/images/file/file_oa.png'),
        unknown: require('@/assets/images/file/file_unknown.png'),
        js: require('@/assets/images/file/file_js.png'),
        html: require('@/assets/images/file/file_html.png'),
        img: require('@/assets/images/file/file_img.png'),
        sql: require('@/assets/images/file/file_sql.png'),
        jar: require('@/assets/images/file/file_jar.png'),
        svg: require('@/assets/images/file/file_svg.png'),
        gif: require('@/assets/images/file/file_gif.png'),
        json: require('@/assets/images/file/file_json.png'),
        exe: require('@/assets/images/file/file_exe.png')
      },
      imageGroupLable: 0,  //  图片展示模式
      fileGroupLable: 0  //  文件展示模式
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
    // 文件类型
    fileType: {
      get() {
        return Number(this.$route.query.fileType)
      },
      set() {
        return 0
      }
    },
    // 图片查看模式 0列表模式 1网格模式 2 时间线模式
    imageModel() {
      return this.$store.getters.imageModel
    },
    // 文件查看模式 0列表模式 1网格模式
    fileModel() {
      return this.$store.getters.fileModel
    }
  },
  watch: {
    // 监听文件查看模式
    fileModel() {
      this.setPageCount()
      this.getTableDataByType()
    }
  },
  created() {
    this.setPageCount()
    this.getTableDataByType()
  },
  mounted() {
    this.imageGroupLable = this.imageModel
    this.fileGroupLable = this.fileModel
  },
  methods: {
    /**
     * 表格数据获取相关事件
     */
    // 调整分页大小
    setPageCount() {
      this.pageData.currentPage = 1
      if(this.fileModel === 0) {
        this.pageData.pageCount = 10
      }
      if(this.fileModel === 1) {
        this.pageData.pageCount = 40
      }
    },
    // 获取文件列表数据
    getTableDataByType() {
      // 分类型
      if (Number(this.fileType)) {
        if(Number(this.fileType) === 6) {
          this.shwoFileRecovery() //  回收站
        } else {
          this.showFileListByType()
        }
      } else {
        // 全部文件
        this.showFileList()
      }
    },
    // 获取当前路径下的文件列表
    showFileList() {
      let data = {
        filePath: this.filePath,
        currentPage: this.pageData.currentPage,
        pageCount: this.pageData.pageCount
      }
      getfilelist(data).then(res => {
        if (res.success) {
          this.fileList = res.data
          this.pageData.total = res.total
          this.loading = false
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    // 获取文件平铺数据
    getFileList() {
      this.pageData.currentPage++
      this.getTableDataByType()
    },
    // 分页组件 当前页码改变
    handleCurrentChange(currentPage) {
      this.pageData.currentPage = currentPage
      this.showFileList()
    },
    // 获取回收站文件列表
    shwoFileRecovery() {
      getRecoveryFile().then(res => {
        if(res.success) {
          this.fileList = res.data
          this.loading = false
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    // 根据文件类型展示文件列表
    showFileListByType() {
      //  分类型
      let data = {
        fileType: this.fileType
      }
      selectFileByFileType(data).then(res => {
        if (res.success) {
          this.fileList = res.data
          this.loading = false
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    //  根据文件扩展名设置文件图片
    setFileImg(extendName) {
      if (extendName === null) {
        //  文件夹
        return this.fileImgMap.dir
      } else if (!this.fileImgTypeList.includes(extendName)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[extendName]
      }
    },
    //  计算文件大小
    calculateFileSize(size) {
      const B = 1024
      const KB = Math.pow(1024, 2)
      const MB = Math.pow(1024, 3)
      const GB = Math.pow(1024, 4)
      if (!size) {
        return '_'
      } else if (size < KB) {
        return (size / B).toFixed(0) + 'KB'
      } else if (size < MB) {
        return (size / KB).toFixed(1) + 'MB'
      } else if (size < GB) {
        return (size / MB).toFixed(2) + 'GB'
      } else {
        return (size / GB).toFixed(3) + 'TB'
      }
    },

    /**
     * 表格勾选框事件
     */
    //  勾选的行
    setSelectionFile(selection) {
      this.selectionFile = selection
    },

    /**
     * 移动按钮相关事件
     */
    //  当前操作行
    setOperationFile(operationFile) {
      this.operationFile = operationFile
    },
    //  设置移动文件模态框相关数据，isBatchMove为null时是确认移动，值由之前的值而定
    setMoveFileDialogData(isBatchMove, visible) {
      this.initFileTree()
      this.dialogMoveFile.isBatchMove = isBatchMove
        ? isBatchMove
        : this.dialogMoveFile.isBatchMove
      this.dialogMoveFile.visible = visible
    },
    //  移动文件模态框：初始化文件目录树
    initFileTree() {
      getFileTree().then(res => {
        if (res.success) {
          this.dialogMoveFile.fileTree = [res.data]
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    //  设置移动后的文件路径
    setSelectFilePath(selectFilePath) {
      this.selectFilePath = selectFilePath
    },
    //  移动文件模态框-确定按钮事件
    confirmMoveFile() {
      if (this.dialogMoveFile.isBatchMove) {
        //  批量移动
        let data = {
          filePath: this.selectFilePath,
          files: JSON.stringify(this.selectionFile)
        }
        batchMoveFile(data).then(res => {
          if (res.success) {
            this.$message.success(res.data)
            this.getTableDataByType()
            this.dialogMoveFile.visible = false
            this.selectionFile = []
          } else {
            this.$message.error(res.errorMessage)
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
        moveFile(data).then(res => {
          if (res.success) {
            this.$message.success('移动文件成功')
            this.getTableDataByType()
            this.dialogMoveFile.visible = false
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      }
    },
    /**
     * 操作按钮组相关事件
     */
    //  切换图片查看模式
    changeImageDisplayModel(label) {
      this.$store.commit('changeImageModel', label)
    },
    // 切换文件查看模式
    changeFileDisplayModel(label) {
      this.$store.commit('changeFileModel', label)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.file-list-wrapper
  .file-list-header
    padding 0
    .el-dialog-div
      height 200px
      overflow auto
  .middle-wrapper.file-type-6
    margin 8px 0
    justify-content flex-end
  .middle-wrapper
    margin-bottom 8px
    display flex
    justify-content space-between
    .breadcrumb
      flex 1
    .change-image-model,
    .change-file-model
      margin-right 20px
      height 30px
      line-height 30px
  .el-pagination
    border-top 1px solid $BorderBase
    padding 8px
    text-align center
</style>