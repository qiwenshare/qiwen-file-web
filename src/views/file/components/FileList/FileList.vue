<template>
  <div class="file-list-wrapper">
    <el-header class="file-list-header">
      <OperationMenu
        :operationFile="operationFile"
        :selectionFile="selectionFile"
        @showFileList="showFileList"
        :filepath="filepath"
      ></OperationMenu>
    </el-header>
    <BreadCrumb class="breadCrumb" :filepath="filepath"></BreadCrumb>
    <el-table
      class="file-table"
      @select-all="selectAllFileRow"
      @select="selectFileRow"
      ref="multipleTable"
      :data="fileList"
      tooltip-effect="dark"
      v-loading="loading"
      element-loading-text="数据加载中"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="文件名" width="500">
        <template slot-scope="scope">
          <a style="cursor:pointer" @click="clickFileName(scope.$index, scope.row)">
            <img v-bind:src="scope.row.imageurl" style="max-width: 30px;" />
            {{scope.row.filename}}
            <span
              v-if="scope.row.isdir==0 && scope.row.extendname != null"
            >.</span>
            {{scope.row.extendname}}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ scope.row.filesize==0?'-':
            (scope.row.filesize/1024 < 1024 ? (scope.row.filesize/1024).toFixed(0) + 'KB':
            (scope.row.filesize/1024/1024 < 1024 ? (scope.row.filesize/1024/1024).toFixed(1) + 'MB' :
            (scope.row.filesize/1024/1024/1024 < 1024 ? (scope.row.filesize/1024/1024/1024).toFixed(2) + 'GB' :
            (scope.row.filesize/1024/1024/1024).toFixed(3) + 'TB'))) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uploadtime" label="修改日期" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!--  @click.native="moveFile(scope.row)" -->
              <el-dropdown-item @click.native="showMoveFileDialog(scope.row)">移动到</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.extendname=='zip'"
                @click.native="unzipFile(scope.row)"
              >解压缩</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.isdir === 0">
                <a
                  :href="scope.row.url"
                  target="_blank"
                  :download="scope.row.filename+'.'+scope.row.extendname"
                  style="display: block;color: inherit;"
                >下载</a>
              </el-dropdown-item>
              <el-dropdown-item @click.native="deleteFile(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!--选择目录弹出窗dialog-->
    <el-dialog title="选择目录" :visible.sync="dialogMoveFileVisible">
      <div class="el-dialog-div">
        <el-tree
          :data="fileTree"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="selectNodeClick"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveFileVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMoveFile">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from './components/BreadCrumb'
import {
  getFileTree,
  moveFile,
  unzipfile,
  deleteFile,
  getfilelist
} from '@/request/file.js'

export default {
  name: 'FileList',
  data() {
    return {
      loading: true,
      fileList: [],
      dialogMoveFileVisible: false,
      fileTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectFilePath: '', //移动文件路径
      operationFile: {}, //当前操作行
      selectionFile: [], //选择的文件
      filepath: '',
      filetype: ''
    }
  },
  components: {
    BreadCrumb,
    OperationMenu
  },
  created: function() {
    let filepath = this.$route.query.filepath

    if (filepath == null) {
      filepath = '/'
    }
    this.filepath = filepath
    this.showFileList(filepath)
  },
  watch: {
    $route(to) {
      let filepath = to.query.filepath

      this.filetype = to.query.filetype
      if (filepath == null) {
        filepath = '/'
      }
      this.filepath = filepath
      this.showFileList(filepath)
    }
  },
  methods: {
    selectAllFileRow(selection) {
      this.selectionFile = selection
    },
    selectFileRow(selection) {
      this.selectionFile = selection
    },
    initFileTree() {
      getFileTree().then(res => {
        if (res.success) {
          this.fileTree = [res.data]
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    confirmMoveFile() {
      this.dialogMoveFileVisible = false
      let data = {
        oldfilepath: this.operationFile.filepath,
        newfilepath: this.selectFilePath,
        filename: this.operationFile.filename,
        extendname: this.operationFile.extendname
      }
      moveFile(data).then(res => {
        if (res.success) {
          this.showFileList(this.filepath)
          this.$message.success('移动文件成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    unzipFile: function(fileInfo) {
      const loading = this.$loading({
        lock: true,
        text: '正在解压缩，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      unzipfile(fileInfo).then(res => {
        if (res.success) {
          this.showFileList(this.filepath)
          this.$message.success('解压成功')
          loading.close()
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    selectNodeClick: function(data) {
      if (data.attributes.filepath == null) {
        this.selectFilePath = '/'
      } else {
        this.selectFilePath = data.attributes.filepath
      }
    },
    showMoveFileDialog(file) {
      this.operationFile = file
      this.dialogMoveFileVisible = true
      this.initFileTree()
    },
    clickFileName(index, row) {
      this.$router.push(row.url)
    },
    getImagePathByExtend(extendname) {
      if (extendname == 'png' || extendname == 'jpg' || extendname == 'jpeg') {
        extendname = 'pic'
      } else if (extendname == 'docx' || extendname == 'doc') {
        extendname = 'word'
      } else if (extendname == 'ppt' || extendname == 'pptx') {
        extendname = 'ppt'
      } else if (extendname == 'xls' || extendname == 'xlsx') {
        extendname = 'excel'
      } else if (extendname == 'mp4') {
        extendname = 'video'
      } else if (
        extendname == 'css' ||
        extendname == 'csv' ||
        extendname == 'chm' ||
        extendname == 'zip'
      ) {
        let t = extendname
        extendname = t
      } else {
        extendname = 'unknown'
      }

      return require('@/assets/images/file/file_' + extendname + '.png')
    },
    confirmDeleteFile(fileInfo) {
      deleteFile(fileInfo).then(res => {
        if (res.success) {
          this.showFileList(this.filepath)
          this.$message.success('移动成功')
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
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
    showFileList(filepath) {
      let data = {
        filepath: filepath
      }
      getfilelist(data).then(res => {
        if (res.success) {
          var data = res.data
          var dirArr = []
          var fileArr = []
          for (var i = 0; i < data.length; i++) {
            var isdir = data[i].isdir
            var filename = data[i].filename
            var extendname = data[i].extendname
            var url = '/file?filepath=' + filepath + filename + '/'
            if (this.filetype != null) {
              url = url + '&filetype=' + this.filetype
            }
            var fileurl = data[i].fileurl
            var imageurl = require('@/assets/images/file/dir.png')

            if (isdir == 0) {
              url = 'api' + fileurl
              imageurl = this.getImagePathByExtend(extendname)
            }
            var dataMap = data[i]
            dataMap.isdir = isdir
            dataMap.isshow = false

            dataMap.imageurl = imageurl
            dataMap.extendname = extendname
            dataMap.url = url

            if (isdir == 1) {
              dirArr.push(dataMap)
            } else {
              fileArr.push(dataMap)
            }
          }
          this.fileList = dirArr.concat(fileArr)
          this.loading = false
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
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
</style>