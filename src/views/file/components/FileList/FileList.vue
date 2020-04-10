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
        @showFileTreeDialog="showFileTreeDialog"
      ></OperationMenu>
    </el-header>
    <div class="middle-wrapper">
      <!-- 面包屑导航栏 -->
      <BreadCrumb class="breadcrumb"></BreadCrumb>
      <!-- 选择表格列 -->
      <SelectColumn class="select-column"></SelectColumn>
    </div>
    <!-- 文件表格 -->
    <el-table
      class="file-table"
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="数据加载中"
      tooltip-effect="dark"
      :data="tableData"
      :default-sort="{ prop: 'isdir', order: 'descending'}"
      @select-all="selectAllFileRow"
      @select="selectFileRow"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label prop="isdir" width="60">
        <template slot-scope="scope">
          <img :src="setFileImg(scope.row.extendname)" style="max-width: 30px;" />
        </template>
      </el-table-column>
      <el-table-column
        prop="filename"
        :sort-by="['isdir','filename']"
        sortable
        show-overflow-tooltip
      >
        <template slot="header">
          <span>文件名</span>
          <el-input
            v-model="fileNameSearch"
            size="mini"
            style="width: 200px;display: inline-block;float:right;margin-right: calc(100% - 294px);"
            placeholder="输入文件名搜索"/>
        </template>
        <template slot-scope="scope">
          <div style="cursor:pointer" @click="clickFileName(scope.row)">
            {{scope.row.filename}}
            <span v-if="!scope.row.isdir && scope.row.extendname !== null">.</span>
            {{scope.row.extendname}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="80"
        prop="extendname"
        :sort-by="['isdir','extendname']"
        sortable
        show-overflow-tooltip
        v-if="selectedColumnList.includes('extendname')"
      ></el-table-column>
      <el-table-column
        label="大小"
        width="80"
        prop="filesize"
        :sort-by="['isdir','filesize']"
        sortable
        show-overflow-tooltip
        align="right"
        v-if="selectedColumnList.includes('filesize')"
      >
        <template slot-scope="scope">
          <div style="padding: 0 10px;">{{calculateFileSize(scope.row.filesize)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="修改日期"
        prop="uploadtime"
        width="180"
        :sort-by="['isdir','uploadtime']"
        show-overflow-tooltip
        sortable
        v-if="selectedColumnList.includes('uploadtime')"
      ></el-table-column>
      <el-table-column :width="operaColumnWidth">
        <template slot="header">
          <span>操作</span>
          <i class="el-icon-circle-plus" title="展开操作列按钮" @click="$store.commit('changeOperaColumnExpand', 1)"></i>
          <i class="el-icon-remove" title="收起操作列按钮" @click="$store.commit('changeOperaColumnExpand', 0)"></i>
        </template>
        <template slot-scope="scope">
          <div v-if="operaColumnExpand">
            <el-button type="danger" size="mini" @click.native="deleteFile(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click.native="showMoveFileDialog(scope.row)">移动</el-button>
            <el-button type="success" size="mini" v-if="scope.row.isdir === 0">
              <a
                target="_blank"
                style="display: block;color: inherit;"
                :href="scope.row.url"
                :download="scope.row.filename+'.'+scope.row.extendname"
              >下载</a>
            </el-button>
            <el-button type="warning" size="mini" @click.native="unzipFile(scope.row)" v-if="scope.row.extendname=='zip'">解压缩</el-button>
          </div>
          <el-dropdown trigger="click" v-else>
            <el-button size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="deleteFile(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="showMoveFileDialog(scope.row)">移动</el-dropdown-item>
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
    <!-- 查看图片 -->
    <div class="img-review-wrapper" v-show="imgReview.visible" @click="imgReview.visible = false">
      <img class="img-large" :src="imgReview.url" alt />
    </div>
  </div>
</template>

<script>
import OperationMenu from './components/OperationMenu'
import BreadCrumb from './components/BreadCrumb'
import SelectColumn from './components/SelectColumn'
import {
  getfilelist,
  moveFile,
  unzipfile,
  deleteFile,
  getFileTree,
  batchMoveFile,
  getstorage
} from '@/request/file.js'

export default {
  name: 'FileList',
  components: {
    OperationMenu,
    BreadCrumb,
    SelectColumn
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
    },
    //  过滤后的表格数据
    tableData() {
      return this.fileList.filter(data => !this.fileNameSearch || data.filename.toLowerCase().includes(this.fileNameSearch.toLowerCase()))
    },
    //  判断当前用户设置的左侧栏是否折叠
    selectedColumnList() {
      return this.$store.state.selectedColumnList
    },
    //  判断当前用户设置的操作列是否展开
    operaColumnExpand() {
      return this.$store.state.operaColumnExpand
    },
    //  判断当前路径下是否有普通文件
    isIncludeNormalFile() {
      return this.fileList.map(data => data.isdir).includes(0)
    },
    //  判断当前路径下是否有压缩文件
    isIncludeZipRarFile() {
      return this.fileList.map(data => data.extendname).includes('zip') || this.fileList.map(data => data.extendname).includes('rar')
    },
    operaColumnWidth() {
      return this.operaColumnExpand ? (this.isIncludeNormalFile ? ( this.isIncludeZipRarFile ? 300 : 220) : 150 ): 150
    }
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

    //  点击文件名
    clickFileName(row) {
      //  若是目录则进入目录
      if (row.isdir) {
        this.$router.push({
          query: {
            filepath: row.filepath + row.filename + '/',
            filetype: '0'
          }
        })
      }
      //  若是文件，则进行相应的预览
      else {
        //  若当前点击项是图片
        const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
        if (PIC.includes(row.extendname)) {
          this.imgReview.url = 'api' + row.fileurl
          this.imgReview.visible = true
        }
        //  若当前点击项是pdf
        if (row.extendname === 'pdf') {
          window.open('api' + row.fileurl, '_blank')
        }
        //  若当前点击项是html、js、css、json
        const CODE = ['html', 'js', 'css', 'json']
        if (CODE.includes(row.extendname)) {
          window.open('api' + row.fileurl, '_blank')
        }
        //  若当前点击项是视频mp4格式
        const VIDEO = ['mp4']
        if (VIDEO.includes(row.extendname)) {
          window.open('api' + row.fileurl, '_blank')
        }
        //  若当前点击项是视频mp3格式
        const AUDIO = ['mp3']
        if (AUDIO.includes(row.extendname)) {
          window.open('api' + row.fileurl, '_blank')
        }
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
          this.showStorage()
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
  .file-table
    height calc(100vh - 180px)
    >>> .el-table__header-wrapper
      .el-icon-circle-plus
      .el-icon-remove
        margin-left 6px
        cursor pointer
        font-size 16px
        &:hover
          color $Primary
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
  .img-review-wrapper
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    overflow auto
    width 100%
    height 100%
    z-index 2010
    text-align center
    display flex
    align-items center
    animation imgReviewAnimation 0.3s
    -webkit-animation imgReviewAnimation 0.3s /* Safari and Chrome */
    animation-iteration-count 0.3
    -webkit-animation-iteration-count 0.3
    animation-fill-mode forwards
    -webkit-animation-fill-mode forwards /* Safari 和 Chrome */
    @keyframes imgReviewAnimation
      0%
        background transparent
      100%
        background rgba(0, 0, 0, 0.8)
    @keyframes imgReviewAnimation
      0%
        background transparent
      100%
        background rgba(0, 0, 0, 0.8)
    .img-large
      margin 0 auto
      max-width 80%
      max-height 100%
  .breadcrumb
    flex 1
  .middle-wrapper
    display flex
</style>