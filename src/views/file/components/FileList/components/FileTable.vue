<template>
  <div class="file-table-wrapper">
    <!-- 文件表格 -->
    <el-table
      class="file-table"
      :class="'file-type-' + fileType"
      ref="multipleTable"
      fit
      v-loading="loading"
      element-loading-text="文件加载中……"
      tooltip-effect="dark"
      :data="fileList"
      :default-sort="{ prop: 'isDir', order: 'descending' }"
      @selection-change="handleSelectRow"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label prop="isDir" width="60" align="center">
        <template slot-scope="scope">
          <img :src="setFileImg(scope.row)" style="width: 30px" />
        </template>
      </el-table-column>
      <el-table-column prop="fileName" :sort-by="['isDir', 'fileName']" sortable show-overflow-tooltip>
        <template slot="header">
          <span>文件名</span>
        </template>
        <template slot-scope="scope">
          <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
            {{ scope.row | fileNameComplete }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="fileType === 6 ? '原路径' : '路径'"
        prop="filePath"
        show-overflow-tooltip
        v-if="Number($route.query.fileType)"
      >
        <template slot-scope="scope">
          <span
            style="cursor: pointer"
            title="点击跳转"
            @click="
              $router.push({
                query: { filePath: scope.row.filePath, fileType: 0 }
              })
            "
            >{{ scope.row.filePath }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="80"
        prop="extendName"
        :sort-by="['isDir', 'extendName']"
        sortable
        show-overflow-tooltip
        v-if="selectedColumnList.includes('extendName')"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.extendName">{{ scope.row.extendName }}</span>
          <span v-else>文件夹</span>
        </template>
      </el-table-column>
      <el-table-column
        label="大小"
        width="80"
        prop="fileSize"
        :sort-by="['isDir', 'fileSize']"
        sortable
        show-overflow-tooltip
        align="right"
        v-if="selectedColumnList.includes('fileSize')"
      >
        <template slot-scope="scope">
          <div style="padding: 0 10px">
            {{ calculateFileSize(scope.row.fileSize) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="修改日期"
        prop="uploadTime"
        width="180"
        :sort-by="['isDir', 'uploadTime']"
        show-overflow-tooltip
        sortable
        v-if="selectedColumnList.includes('uploadTime')"
      ></el-table-column>
      <el-table-column
        label="删除日期"
        prop="deleteTime"
        width="180"
        :sort-by="['isDir', 'deleteTime']"
        show-overflow-tooltip
        sortable
        v-if="fileType === 6 && selectedColumnList.includes('deleteTime')"
      ></el-table-column>
      <el-table-column :width="operaColumnWidth">
        <template slot="header">
          <span>操作</span>
          <i class="el-icon-circle-plus" title="展开" @click="operaColumnExpand = true"></i>
          <i class="el-icon-remove" title="折叠" @click="operaColumnExpand = false"></i>
        </template>
        <template slot-scope="scope">
          <div v-if="operaColumnExpand">
            <el-button type="text" size="mini" @click.native="handleDeleteFileBtnClick(scope.row)">删除</el-button>
            <el-button
              type="text"
              size="mini"
              @click.native="handleRestoreFileBtnClick(scope.row)"
              v-if="fileType === 6"
              >还原</el-button
            >
            <el-button type="text" size="mini" @click.native="handleMoveFileBtnClick(scope.row)" v-if="fileType !== 6"
              >移动</el-button
            >
            <el-button type="text" size="mini" @click.native="handleRenameFileBtnClick(scope.row)" v-if="fileType !== 6"
              >重命名</el-button
            >
            <el-button type="text" size="mini" v-if="scope.row.isDir === 0 && fileType !== 6">
              <a target="_blank" style="display: block; color: inherit" :href="getDownloadFilePath(scope.row)">下载</a>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click.native="handleUnzipFileBtnClick(scope.row)"
              v-if="fileType !== 6 && (scope.row.extendName == 'zip' || scope.row.extendName == 'rar')"
              >解压缩</el-button
            >
          </div>
          <el-dropdown trigger="click" v-else>
            <el-button size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDeleteFileBtnClick(scope.row)">删除</el-dropdown-item>
              <el-dropdown-item @click.native="handleRestoreFileBtnClick(scope.row)" v-if="fileType === 6"
                >还原</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleMoveFileBtnClick(scope.row)" v-if="fileType !== 6"
                >移动</el-dropdown-item
              >
              <el-dropdown-item @click.native="handleRenameFileBtnClick(scope.row)" v-if="fileType !== 6"
                >重命名</el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.extendName === 'zip' && fileType !== 6"
                @click.native="handleUnzipFileBtnClick(scope.row)"
                >解压缩</el-dropdown-item
              >
              <el-dropdown-item v-if="scope.row.isDir === 0 && fileType !== 6">
                <a
                  target="_blank"
                  style="display: block; color: inherit"
                  :href="getDownloadFilePath(scope.row)"
                  >下载</a
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { unzipFile, deleteFile, renameFile, deleteRecoveryFile, restoreRecoveryFile } from '@/request/file.js'
import { mapGetters } from 'vuex'

export default {
  name: 'FileTable',
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
    // 文件列表
    fileList: {
      required: true,
      type: Array
    },
    // 文件加载状态
    loading: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      operaColumnExpand: this.getCookies('operaColumnExpand') || false, //  表格操作列-是否收缩
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
      downloadFilePath: '',
      viewFilePath: ''
    }
  },
  computed: {
    //  selectedColumnList: 判断当前用户设置的左侧栏是否折叠
    ...mapGetters(['selectedColumnList']),
    //  判断当前路径下是否有普通文件
    isIncludeNormalFile() {
      return this.fileList.map((data) => data.isDir).includes(0)
    },
    //  判断当前路径下是否有压缩文件
    isIncludeZipRarFile() {
      return (
        this.fileList.map((data) => data.extendName).includes('zip') ||
        this.fileList.map((data) => data.extendName).includes('rar')
      )
    },
    // 操作列宽度
    operaColumnWidth() {
      return this.fileType === 6
        ? 120
        : this.operaColumnExpand
        ? this.isIncludeNormalFile
          ? this.isIncludeZipRarFile
            ? 230
            : 190
          : 160
        : 150
    }
  },
  watch: {
    /**
     * 文件路径变化时清空表格已选行
     */
    filePath() {
      this.$refs.multipleTable.clearSelection()
      this.$emit('setSelectionFile', [])
    },
    /**
     * 文件类型变化时清空表格已选行
     */
    fileType() {
      this.$refs.multipleTable.clearSelection()
      this.$emit('setSelectionFile', [])
    },
    /**
     * 文件列表变化时清空表格已选行
     */
    fileList() {
      this.$refs.multipleTable.clearSelection()
      this.$emit('setSelectionFile', [])
    },
    /**
     * 监听表格操作列按钮折叠状态变化
     * @param {boolean} newValue 折叠状态
     * @description 将状态存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
     */
    operaColumnExpand(newValue) {
      this.setCookies('operaColumnExpand', newValue)
    }
  },
  created() {
    this.operaColumnExpand = this.getCookies('operaColumnExpand') === 'true' //  读取保存的状态
  },
  methods: {
    /**
     * 根据文件扩展名设置文件图片
     * @param {object} row 文件信息
     */
    setFileImg(row) {
      if (!row.extendName) {
        //  文件夹
        return this.fileImgMap.dir
      } else if (!this.fileImgTypeList.includes(row.extendName)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown
      } else if (this.fileType !== 6 && ['jpg', 'png', 'jpeg', 'gif'].includes(row.extendName)) {
        // 图片类型，直接显示缩略图
        return this.getImgMinPath(row)
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[row.extendName]
      }
    },
    /**
     * 格式化文件大小
     * @param {number} size 文件大小
     * @returns {string} 文件大小（带单位）
     */
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
     * 文件名点击事件
     * @description 若当前点击的为文件夹，则进入文件夹内部；若是文件，则进行相应的预览。
     * @param {object} row 文件信息
     */
    handleFileNameClick(row) {
      //  若是目录则进入目录
      if (row.isDir) {
        this.$router.push({
          query: {
            filePath: row.filePath + row.fileName + '/',
            fileType: 0
          }
        })
      }
      //  若是文件，则进行相应的预览
      else {
        //  若当前点击项是图片
        const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
        if (PIC.includes(row.extendName)) {
          let data = {
            imgReviewVisible: true,
            imgReviewList: [
              {
                fileUrl: this.getViewFilePath(row),
                downloadLink: this.getDownloadFilePath(row),
                fileName: row.fileName,
                extendName: row.extendName
              }
            ],
            activeIndex: 0
          }
          this.$store.commit('setImgReviewData', data)
        }
        //  若当前点击项是可以使用office在线预览的
        if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(row.extendName)) {
          window.open(this.getFileOnlineViewPathByOffice(row), '_blank')
        }
        //  若当前点击项是pdf
        if (row.extendName === 'pdf') {
          window.open(this.getViewFilePath(row), '_blank')
        }
        //  若当前点击项是html、js、css、json
        const CODE = ['html', 'js', 'css', 'json']
        if (CODE.includes(row.extendName)) {
          window.open(this.getViewFilePath(row), '_blank')
        }
        //  若当前点击项是视频mp4格式
        const VIDEO = ['mp4']
        if (VIDEO.includes(row.extendName)) {
          window.open(this.getViewFilePath(row), '_blank')
        }
        //  若当前点击项是视频mp3格式
        const AUDIO = ['mp3']
        if (AUDIO.includes(row.extendName)) {
          window.open(this.getViewFilePath(row), '_blank')
        }
      }
    },
    /**
     * 表格选择项发生变化时的回调函数
     * @param {[]} selection 勾选的行数据
     */
    handleSelectRow(selection) {
      this.$emit('setSelectionFile', selection)
    },
    /**
     * 移动按钮点击事件
     * @description 向父组件传递当前操作的文件信息，并打开“移动文件对话框”
     * @param {object} file 文件信息
     */
    handleMoveFileBtnClick(file) {
      this.$emit('setOperationFile', file)
      //  第一个参数: 是否批量移动；第二个参数：打开/关闭移动文件对话框
      this.$emit('setMoveFileDialogData', false, true)
    },
    /**
     * 解压缩按钮点击事件
     * @description 调用解压缩文件接口，并展示新的文件列表
     * @param {object} fileInfo 文件信息
     */
    handleUnzipFileBtnClick(fileInfo) {
      const loading = this.$loading({
        lock: true,
        text: '正在解压缩，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      unzipFile(fileInfo).then((res) => {
        if (res.success) {
          this.$emit('getTableDataByType')
          this.$store.dispatch('showStorage')
          this.$message.success('解压成功')
          loading.close()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    /**
     * 删除按钮点击事件
     * @description 区分 删除到回收站中 | 在回收站中彻底删除，打开确认对话框
     * @param {object} fileInfo 文件信息
     */
    handleDeleteFileBtnClick(fileInfo) {
      if (this.fileType === 6) {
        //  回收站里 - 彻底删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmDeleteFile(fileInfo, true)
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
            this.confirmDeleteFile(fileInfo, false)
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
     * 删除文件确认对话框 | 确定按钮点击事件
     * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
     * @param {object} fileInfo 文件信息
     * @param {boolean} type 文件类型，true 彻底删除；false 删除到回收站
     */
    confirmDeleteFile(fileInfo, type) {
      if (type) {
        //  回收站中删除
        deleteRecoveryFile({
          recoveryFileId: fileInfo.recoveryFileId
        }).then((res) => {
          if (res.success) {
            this.$emit('getTableDataByType')
            this.$store.dispatch('showStorage')
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        //  非回收站删除
        deleteFile(fileInfo).then((res) => {
          if (res.success) {
            this.$emit('getTableDataByType')
            this.$store.dispatch('showStorage')
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    /**
     * 还原按钮点击事件
     * @description 调用接口，在回收站中还原文件
     * @param {object} fileInfo 文件信息
     */
    handleRestoreFileBtnClick(fileInfo) {
      restoreRecoveryFile({
        deleteBatchNum: fileInfo.deleteBatchNum,
        filePath: fileInfo.filePath
      }).then((res) => {
        if (res.success) {
          this.$emit('getTableDataByType')
          this.$store.dispatch('showStorage')
          this.$message.success('已还原')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 文件重命名按钮点击事件
     * @description 打开确认对话框让用户输入新的文件名
     * @param {object} fileInfo 文件信息
     */
    handleRenameFileBtnClick(fileInfo) {
      var fileName = fileInfo.fileName
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: fileName,
        inputPattern: /\S/, //  文件名不能为空
        inputErrorMessage: '请输入文件名',
        closeOnClickModal: false
      })
        .then(({ value }) => {
          fileInfo.oldFileName = fileInfo.fileName
          fileInfo.fileName = value
          this.confirmRenameFile(fileInfo)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    /**
     * 文件重命名对话框 | 确定按钮点击事件
     * @description 调用文件重命名接口
     * @param {object} fileInfo 文件信息
     */
    confirmRenameFile(fileInfo) {
      renameFile(fileInfo).then((res) => {
        if (res.success) {
          this.$emit('getTableDataByType')
          this.$store.dispatch('showStorage')
          this.$message.success('重命名成功')
        } else {
          fileInfo.fileName = fileInfo.oldFileName
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

.file-table-wrapper {
  margin-top: 2px;

  .file-type-0 {
    height: calc(100vh - 206px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 264px) !important;
    }
  }

  .file-type-6 {
    height: calc(100vh - 211px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 263px) !important;
    }
  }

  .file-table {
    width: 100% !important;
    height: calc(100vh - 203px);

    >>> .el-table__header-wrapper {
      th {
        background: $tabBackColor;
        padding: 8px 0;
      }

      .el-icon-circle-plus, .el-icon-remove {
        margin-left: 6px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
          color: $Primary;
        }
      }
    }

    >>> .el-table__body-wrapper {
      height: calc(100vh - 255px);
      overflow-y: auto;
      setScrollbar(10px);

      td {
        padding: 8px 0;
      }
    }
  }

  .img-review-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    width: 100%;
    height: 100%;
    z-index: 2010;
    text-align: center;
    display: flex;
    align-items: center;
    animation: imgReviewAnimation 0.3s;
    -webkit-animation: imgReviewAnimation 0.3s; /* Safari and Chrome */
    animation-iteration-count: 0.3;
    -webkit-animation-iteration-count: 0.3;
    animation-fill-mode: forwards;
    -webkit-animation-fill-mode: forwards; /* Safari 和 Chrome */

    @keyframes imgReviewAnimation {
      0% {
        background: transparent;
      }

      100% {
        background: rgba(0, 0, 0, 0.8);
      }
    }

    @keyframes imgReviewAnimation {
      0% {
        background: transparent;
      }

      100% {
        background: rgba(0, 0, 0, 0.8);
      }
    }

    .img-large {
      margin: 0 auto;
      max-width: 80%;
      max-height: 100%;
    }
  }
}
</style>
