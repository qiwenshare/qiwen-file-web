<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header class="file-list-header">
      <OperationMenu
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        :filepath="filepath"
        :storageValue="storageValue"
        @showStorage="showStorage"
        @showFileList="showFileList"
        @setMoveFileDialogData="setMoveFileDialogData"
      ></OperationMenu>
    </el-header>
    <div class="middle-wrapper">
      <!-- 面包屑导航栏 -->
      <BreadCrumb class="breadcrumb"></BreadCrumb>
      <!-- 选择表格列 -->
      <SelectColumn class="select-column"></SelectColumn>
    </div>
    <!-- 文件列表表格 -->
    <FileTable
      :fileList="fileList"
      :loading="loading"
      @setMoveFileDialogData="setMoveFileDialogData"
      @setOperationFile="setOperationFile"
      @setSelectionFile="setSelectionFile"
      @showStorage="showStorage"
      @showFileList="showFileList"
    ></FileTable>
    <!-- 移动文件模态框 -->
    <MoveFileDialog
      :dialogMoveFile="dialogMoveFile"
      @setSelectFilePath="setSelectFilePath"
      @confirmMoveFile="confirmMoveFile"
    ></MoveFileDialog>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from './components/BreadCrumb'
import SelectColumn from './components/SelectColumn'
import FileTable from './components/FileTable'
import MoveFileDialog from './components/MoveFileDialog'
import {
  getfilelist,
  getFileTree,
  getstorage,
  moveFile,
  batchMoveFile
} from '@/request/file.js'

export default {
  name: 'FileList',
  components: {
    OperationMenu,
    BreadCrumb,
    SelectColumn,
    FileTable,
    MoveFileDialog
  },
  data() {
    return {
      storageValue: 0,
      fileNameSearch: '',
      loading: true, //  表格数据-loading
      fileList: [], //  表格数据-文件列表
      //  移动文件模态框数据
      dialogMoveFile: {
        isBatchMove: false,
        visible: false, //  是否可见
        fileTree: [] //  目录树
      },
      selectFilePath: '', //  移动文件路径
      operationFile: {}, // 当前操作行
      selectionFile: [], // 勾选的文件
      filetype: '', //  文件类型
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
      //  查看图片模态框数据
      imgReview: {
        visible: false,
        url: ''
      }
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
    }
  },
  watch: {
    // $route(from, to) {
    //   console.log(from.query)
    //   console.log(to.query)
    // },
    // filepath(newValue, oldValue) {
    //   console.log(newValue, oldValue, "watch执行")
    //   this.showFileList()
    // }
  },
  created() {
    this.showFileList()
    this.showStorage()
  },
  methods: {
    /**
     * 表格数据获取相关事件
     */
    //  获取当前路径下的所有文件
    showFileList() {
      let data = {
        filepath: this.filepath
      }
      getfilelist(data).then(res => {
        if (res.success) {
          this.fileList = res.data
          this.loading = false
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    //  根据文件扩展名设置文件图片
    setFileImg(extendname) {
      if (extendname === null) {
        //  文件夹
        return this.fileImgMap.dir
      } else if (!this.fileImgTypeList.includes(extendname)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[extendname]
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
      console.log(isBatchMove, this.dialogMoveFile.isBatchMove)
      this.dialogMoveFile.visible = visible
      console.log(this.dialogMoveFile.isBatchMove, this.dialogMoveFile.visible)
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
          newfilepath: this.selectFilePath,
          files: JSON.stringify(this.selectionFile)
        }
        batchMoveFile(data).then(res => {
          if (res.success) {
            this.$message.success(res.data)
            this.showFileList()
            this.dialogMoveFile.visible = false
            this.selectionFile = []
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      } else {
        //  单文件移动
        let data = {
          oldfilepath: this.operationFile.filepath,
          newfilepath: this.selectFilePath,
          filename: this.operationFile.filename,
          extendname: this.operationFile.extendname
        }
        moveFile(data).then(res => {
          if (res.success) {
            this.$message.success('移动文件成功')
            this.showFileList()
            this.dialogMoveFile.visible = false
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      }
    },

    //  获取已占用内存
    showStorage() {
      getstorage().then(res => {
        if (res.success) {
          let size = res.data ? res.data.storagesize : 0
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.file-list-wrapper
  .file-list-header
    .el-dialog-div
      height 200px
      overflow auto
  .breadcrumb
    flex 1
  .middle-wrapper
    display flex
</style>