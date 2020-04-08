<template>
  <div class="file-list-wrapper">
    <!-- 操作按钮 -->
    <el-header class="file-list-header">
      <OperationMenu
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        :filepath="filepath"
        @showFileList="showFileList"
        @showFileTreeDialog="showFileTreeDialog"
      ></OperationMenu>
    </el-header>
    <!-- 面包屑导航栏 -->
    <BreadCrumb class="breadcrumb"></BreadCrumb>
    <!-- 文件表格 -->
    <el-table
      class="file-table"
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="数据加载中"
      tooltip-effect="dark"
      :data="fileList"
      :default-sort="{ prop: 'isdir', order: 'descending'}"
      :sort-by="['isdir','uploadtime','filename']"
      @select-all="selectAllFileRow"
      @select="selectFileRow"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label prop="isdir" width="50">
        <template slot-scope="scope">
          <img :src="setFileImg(scope.row.extendname)" style="max-width: 30px;" />
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="filename" sortable>
        <template slot-scope="scope">
          <div style="cursor:pointer" @click="clickFileName(scope.row)">
            {{scope.row.filename}}
            <span v-if="!scope.row.isdir && scope.row.extendname !== null">.</span>
            {{scope.row.extendname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="150" prop="filesize" sortable>
        <template slot-scope="scope">
          <span>{{calculateFileSize(scope.row.filesize)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" prop="uploadtime" width="200" show-overflow-tooltip sortable></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button @click.native="deleteFile(scope.row)" type="danger" size="mini">删除</el-button>
          <el-button @click.native="showMoveFileDialog(scope.row)" type="primary" size="mini">移动</el-button>
          <el-dropdown trigger="click" style="margin-left: 10px;" v-if="scope.row.extendname=='zip' || scope.row.isdir === 0">
            <el-button size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="scope.row.extendname=='zip'"
                @click.native="unzipFile(scope.row)"
              >解压缩</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.isdir === 0">
                <a
                  target="_blank"
                  style="display: block;color: inherit;"
                  :href="scope.row.url"
                  :download="scope.row.filename+'.'+scope.row.extendname"
                >下载</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 移动文件-选择目录模态框 -->
    <el-dialog title="选择目录" :visible.sync="dialogMoveFile.visible">
      <div class="el-dialog-div">
        <el-tree
          :data="dialogMoveFile.fileTree"
          :props="dialogMoveFile.defaultProps"
          :highlight-current="true"
          @node-click="selectNodeClick"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveFile.visible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMoveFile">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from './components/BreadCrumb'
import {
  getfilelist,
  moveFile,
  unzipfile,
  deleteFile,
  getFileTree,
  batchMoveFile
} from '@/request/file.js'

export default {
  name: 'FileList',
  components: {
    BreadCrumb,
    OperationMenu
  },
  data() {
    return {
      loading: true, //  表格数据-loading
      fileList: [], //  表格数据-文件列表
      //  移动文件模态框数据
      dialogMoveFile: {
        isBatchMove: false,
        visible: false, //  是否可见
        fileTree: [], //  目录树
        defaultProps: {
          children: 'children',
          label: 'label'
        }
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
        'mp4',
        'css',
        'csv',
        'chm',
        'zip'
      ],
      //  文件图片Map映射
      fileImgMap: {
        dir: require('@/assets/images/file/dir.png'),
        unknown: require('@/assets/images/file/file_unknown.png'),
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
        css: require('@/assets/images/file/file_css.png'),
        csv: require('@/assets/images/file/file_csv.png'),
        chm: require('@/assets/images/file/file_chm.png'),
        zip: require('@/assets/images/file/file_zip.png')
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
  created() {
    this.showFileList()
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

    //  点击文件名
    clickFileName(row) {
      if (row.isdir) {
        this.$router.push({
          query: {
            filepath: row.filepath + row.filename + '/',
            filetype: '0'
          }
        })
      }
    },

    /**
     * 表格勾选框事件
     */
    //  表格-全选事件
    selectAllFileRow(selection) {
      this.selectionFile = selection
    },
    //  表格-选中一行事件
    selectFileRow(selection) {
      this.selectionFile = selection
    },

    /**
     * 移动按钮相关事件
     */
    //  操作列-移动按钮：打开移动文件模态框
    showMoveFileDialog(file) {
      this.dialogMoveFile.isBatchMove = false
      this.initFileTree()
      this.operationFile = file
      this.dialogMoveFile.visible = true
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
    //  移动文件模态框：选择目录事件
    selectNodeClick(data) {
      this.selectFilePath = data.attributes.filepath
        ? data.attributes.filepath
        : '/'
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
            this.dialogMoveFile.visible = false
            this.showFileList()
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
            this.showFileList()
            this.$message.success('移动文件成功')
            this.dialogMoveFile.visible = false
          } else {
            this.$message.error(res.errorMessage)
          }
        })
      }
    },

    //  操作列-解压缩按钮
    unzipFile: function(fileInfo) {
      const loading = this.$loading({
        lock: true,
        text: '正在解压缩，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      unzipfile(fileInfo).then(res => {
        if (res.success) {
          this.showFileList()
          this.$message.success('解压成功')
          loading.close()
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },

    /**
     * 删除按钮相关事件
     */
    //  操作列-删除按钮
    deleteFile(fileInfo) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.confirmDeleteFile(fileInfo)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //  删除文件模态框-确定按钮
    confirmDeleteFile(fileInfo) {
      deleteFile(fileInfo).then(res => {
        if (res.success) {
          this.showFileList()
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },

    /**
     * 操作按钮相关事件
     */
    //  控制目录树模态框是否显示
    showFileTreeDialog(param) {
      this.dialogMoveFile.isBatchMove = true //  是批量移动
      this.initFileTree()
      this.dialogMoveFile.visible = param
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
  .file-table
    height calc(100vh - 180px)
    >>> .el-table__body-wrapper
      height calc(100vh - 228px)
      overflow-y auto
      /* 修改 滚动条 下面 的 宽度 */
      &::-webkit-scrollbar
        width 10px
      /* 修改 滚动条的 下面 的 样式 */
      &::-webkit-scrollbar-track
        background-color #EBEEF5
        -webkit-border-radius 2em
        -moz-border-radius 2em
        border-radius 2em
      /* 修改 滑块 */
      &::-webkit-scrollbar-thumb
        background-color #909399
        -webkit-border-radius 2em
        -moz-border-radius 2em
        border-radius 2em
  >>> .el-dialog
    .el-dialog__header
      display flex
    .el-dialog__body
      padding 10px 30px
      .el-tree
        .el-tree-node__content
          height 34px
          font-size 16px
          .el-icon-caret-right
            font-size 18px
        .el-tree-node.is-current>.el-tree-node__content
          color $Primary
          .el-tree-node__expand-icon
            color inherit
</style>