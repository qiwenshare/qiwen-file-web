<template>
  <!-- 文件平铺 -->
  <div class="file-grid-wrapper">
    <ul class="file-list" v-loading="loading" element-loading-text="文件加载中……" @click.self="rightMenu.isShow = false" @scroll="rightMenu.isShow = false">
      <li
        class="file-item"
        v-for="(item, index) in fileListSorted"
        :key="index"
        :title="item | fileNameComplete"
        @click="clickFileName(item, index, fileListSorted)"
        @contextmenu.prevent="rightClickFile(item, index, $event)"
      >
        <img class="file-img" :src="setFileImg(item)" />
        <div class="file-name">{{ item | fileNameComplete }}</div>
        <div
          class="file-checked-wrapper"
          :class="{ checked: item.checked }"
          v-show="batchOperate"
          @click.stop.self="item.checked = !item.checked"
        >
          <el-checkbox
            class="file-checked"
            v-model="item.checked"
            @click.stop="item.checked = !item.checked"
          ></el-checkbox>
        </div>
      </li>
    </ul>
    <transition name="el-fade-in-linear">
      <div class="right-menu" v-show="rightMenu.isShow" :style="`top: ${rightMenu.top}px; left: ${rightMenu.left}px;`">
        <el-button type="info" size="small" plain @click.native="deleteFileBtn(selectedFile)">删除</el-button>
        <el-button type="info" size="small" plain @click.native="showMoveFileDialog(selectedFile)" v-if="fileType !== 6"
          >移动</el-button
        >
        <el-button type="info" size="small" plain @click.native="renameFile(selectedFile)" v-if="fileType !== 6"
          >重命名</el-button
        >
        <el-button
          type="info"
          size="small"
          plain
          v-if="selectedFile.isDir === 0 && fileType !== 6"
          @click.native="rightMenu.isShow = false"
        >
          <a
            target="_blank"
            style="display: block;color: inherit;"
            :href="getDownloadFilePath(selectedFile)"
            :download="selectedFile.fileName + '.' + selectedFile.extendName"
            >下载</a
          >
        </el-button>
        <el-button
          type="info"
          size="small"
          plain
          @click.native="unzipFile(selectedFile)"
          v-if="fileType !== 6 && (selectedFile.extendName == 'zip' || selectedFile.extendName == 'rar')"
          >解压缩</el-button
        >
      </div>
    </transition>
  </div>
</template>

<script>
import { unzipfile, deleteFile, renameFile, deleteRecoveryFile } from '@/request/file.js'
import { mapGetters } from 'vuex'
import 'element-ui/lib/theme-chalk/base.css'

export default {
  name: 'FileGrid',
  props: {
    fileList: Array, //  文件列表
    loading: Boolean,
    batchOperate: Boolean
  },
  data() {
    return {
      fileListSorted: [],
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
        json: require('@/assets/images/file/file_json.png'),
        exe: require('@/assets/images/file/file_exe.png')
      },
      downloadFilePath: '',
      viewFilePath: '',
      // 右键菜单
      rightMenu: {
        isShow: false,
        top: 0,
        left: 0
      },
      selectedFile: {}
    }
  },
  computed: {
    /**
     * selectedColumnList: 列显隐
     * operaColumnExpand: 判断当前用户设置的操作列是否展开 0不展开 1展开
     * fileModel: 文件查看模式 0列表模式 1网格模式
     *  */
    ...mapGetters(['selectedColumnList', 'operaColumnExpand', 'fileModel']),
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
    // 批量操作模式 - 被选中的文件
    selectedFileList() {
      let res = this.fileListSorted.filter((item) => item.checked)
      return res
    }
  },
  watch: {
    // 文件平铺模式 排序-文件夹在前
    fileList(newValue) {
      this.fileListSorted = [...newValue]
        .sort((pre, next) => {
          return next.isDir - pre.isDir
        })
        .map((item) => {
          return {
            ...item,
            checked: false
          }
        })
    },
    // 批量操作模式 - 被选中的文件
    selectedFileList(newValue) {
      if (newValue.length) {
        this.$emit('setSelectionFile', newValue)
      }
    }
  },
  methods: {
    /**
     * 文件操作相关书事件
     */
    // 文件右键事件
    rightClickFile(item, index, mouseEvent) {
      if (!this.batchOperate) {
        this.rightMenu.isShow = false
        setTimeout(() => {
          this.selectedFile = item
          this.rightMenu.top = mouseEvent.clientY - 64
          this.rightMenu.left = mouseEvent.clientX + 18
          this.rightMenu.isShow = true
        }, 100)
      }
    },
    /**
     * 表格数据获取相关事件
     */
    //  根据文件扩展名设置文件图片
    setFileImg(row) {
      if (!row.extendName) {
        //  文件夹
        return this.fileImgMap.dir
      } else if (!this.fileImgTypeList.includes(row.extendName)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown
      } else if (this.fileType !== 6 && ['jpg', 'png', 'jpeg', 'gif'].includes(row.extendName)) {
        // 图片类型，直接显示缩略图
        return this.downloadImgMin(row)
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[row.extendName]
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
    clickFileName(row, activeIndex, imgList) {
      this.rightMenu.isShow = false
      //  若是目录则进入目录
      if (row.isDir) {
        this.$router.push({
          query: {
            filePath: row.filePath + row.fileName + '/',
            fileType: 0
          }
        })
      } else {
        //  若是文件，则进行相应的预览
        //  若当前点击项是图片
        const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
        if (PIC.includes(row.extendName)) {
          if (this.fileType === 1) {  //  图片分类下 - 大图查看
            let data = {
              imgReviewVisible: true,
              imgReviewList: imgList.map((item) => {
                return {
                  fileUrl: this.getViewFilePath(item),
                  downloadLink: this.getDownloadFilePath(item),
                  fileName: item.fileName,
                  extendName: item.extendName
                }
              }),
              activeIndex: activeIndex
            }
            this.$store.commit('setImgReviewData', data)
          } else {  //  非图片分类下 - 大图查看
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
     * 移动按钮相关事件
     */
    //  操作列-移动按钮：打开移动文件模态框
    showMoveFileDialog(file) {
      this.rightMenu.isShow = false
      //  第一个参数: 是否批量移动；第二个参数：打开/关闭移动文件模态框
      this.$emit('setOperationFile', file)
      this.$emit('setMoveFileDialogData', false, true)
    },
    //  操作列-解压缩按钮
    unzipFile(fileInfo) {
      this.rightMenu.isShow = false
      const loading = this.$loading({
        lock: true,
        text: '正在解压缩，请稍等片刻...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      unzipfile(fileInfo).then((res) => {
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
     * 删除按钮相关事件
     */
    //  操作列-删除按钮
    deleteFileBtn(fileInfo) {
      this.rightMenu.isShow = false
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
    //  删除文件模态框-确定按钮
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
    // 文件重命名
    renameFile(fileInfo) {
      this.rightMenu.isShow = false
      var fileName = fileInfo.fileName
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: fileName
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
    // 文件重命名模态框 确定按钮
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
@import '~@/assets/styles/varibles.styl'
@import '~@/assets/styles/mixins.styl'

.file-grid-wrapper
  .file-list
    height calc(100vh - 206px)
    overflow-y auto
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content flex-start
    setScrollbar(10px)
    .file-item
      margin 0 16px 16px 0
      position relative
      width 120px
      padding 8px
      text-align center
      cursor pointer
      &:hover
        background $tabBackColor
        .file-name
          font-weight 550
      .file-img
        width 80px
        height 80px
      .file-name
        margin-top 8px
        height 44px
        line-height 22px
        font-size 12px
        word-break break-all
        setEllipsis(2)
      .file-checked-wrapper
        position absolute
        top 0
        left 0
        z-index 2
        background rgba(245, 247, 250, 0.5)
        width 100%
        height 100%
        .file-checked
          position absolute
          top 16px
          left 24px
      .file-checked-wrapper.checked
        background rgba(245, 247, 250, 0)
  .right-menu
    position fixed
    display flex
    flex-direction column
    >>> .el-button
      margin 0
      border-radius 0
</style>
