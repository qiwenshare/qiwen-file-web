<template>
  <div class="file-table-wrapper">
    <!-- 文件表格 -->
    <el-table
      class="file-table"
      :class="['file-type-' + fileType, routeName === 'Share' ? 'share' : routeName === 'MyShare' ? 'my-share' : '']"
      ref="multipleTable"
      fit
      v-loading="loading"
      element-loading-text="文件加载中……"
      tooltip-effect="dark"
      :data="fileList"
      :highlight-current-row="true"
      @selection-change="handleSelectRow"
      @sort-change="handleSortChange"
      @row-contextmenu="handleContextMenu"
    >
      <el-table-column type="selection" key="selection" width="55"></el-table-column>
      <el-table-column label prop="isDir" key="isDir" width="60" align="center">
        <template slot-scope="scope">
          <img
            :src="setFileImg(scope.row)"
            :title="`${scope.row.isDir ? '' : '点击预览'}`"
            style="width: 30px; max-height: 30px; cursor: pointer"
            @click="handleFileNameClick(scope.row, scope.$index, fileList)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="fileName" key="fileName" :sort-by="['isDir', 'fileName']" sortable show-overflow-tooltip>
        <template slot="header">
          <span>文件名</span>
        </template>
        <template slot-scope="scope">
          <div
            style="cursor: pointer"
            :title="`${scope.row.isDir ? '' : '点击预览'}`"
            @click="handleFileNameClick(scope.row, scope.$index, fileList)"
          >
            {{ scope.row | fileNameComplete }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="fileType === 6 ? '原路径' : '路径'"
        prop="filePath"
        key="filePath"
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
        key="extendName"
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
        key="fileSize"
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
        key="uploadTime"
        width="180"
        :sort-by="['isDir', 'uploadTime']"
        sortable
        align="center"
        v-if="selectedColumnList.includes('uploadTime') && ![7, 8].includes(fileType)"
      ></el-table-column>
      <el-table-column
        label="删除日期"
        prop="deleteTime"
        key="deleteTime"
        width="180"
        :sort-by="['isDir', 'deleteTime']"
        sortable
        align="center"
        v-if="fileType === 6 && selectedColumnList.includes('deleteTime')"
      ></el-table-column>
      <el-table-column
        label="分享类型"
        prop="shareType"
        key="shareType"
        width="100"
        align="center"
        v-if="routeName === 'MyShare'"
      >
        <template slot-scope="scope">
          {{ scope.row.shareType === 1 ? '私密' : '公共' }}
        </template>
      </el-table-column>
      <el-table-column
        label="分享时间"
        prop="shareTime"
        key="shareTime"
        width="180"
        :sort-by="['isDir', 'shareTime']"
        show-overflow-tooltip
        sortable
        align="center"
        v-if="routeName === 'MyShare'"
      ></el-table-column>
      <el-table-column
        label="过期时间"
        prop="endTime"
        key="endTime"
        width="190"
        :sort-by="['isDir', 'endTime']"
        show-overflow-tooltip
        sortable
        align="center"
        v-if="routeName === 'MyShare'"
      >
        <template slot-scope="scope">
          <div>
            <i class="el-icon-warning" v-if="getFileShareStatus(scope.row.endTime)"></i>
            <i class="el-icon-time" v-else></i>
            {{ scope.row.endTime }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 右键列表 -->
    <transition name="el-fade-in-linear">
      <ul
        class="right-menu-list"
        id="rightMenuList"
        v-show="rightMenu.isShow"
        :style="`top: ${rightMenu.top};right: ${rightMenu.right};bottom: ${rightMenu.bottom};left: ${rightMenu.left};`"
      >
        <li class="right-menu-item" @click="handleFileNameClick(selectedFile, 0)" v-if="seeBtnShow">
          <i class="el-icon-view"></i> 查看
        </li>
        <li class="right-menu-item" @click="handleDeleteFileBtnClick(selectedFile)" v-if="deleteBtnShow">
          <i class="el-icon-delete"></i> 删除
        </li>
        <li class="right-menu-item" @click="handleRestoreFileBtnClick(selectedFile)" v-if="restoreBtnShow">
          <i class="el-icon-refresh-left"></i> 还原
        </li>
        <li class="right-menu-item" @click="handleMoveFileBtnClick(selectedFile)" v-if="moveBtnShow">
          <i class="el-icon-s-promotion"></i> 移动
        </li>
        <li class="right-menu-item" @click="handleRenameFileBtnClick(selectedFile)" v-if="renameBtnShow">
          <i class="el-icon-edit-outline"></i> 重命名
        </li>
        <li class="right-menu-item" @click="handleShareFileBtnClick(selectedFile)" v-if="shareBtnShow">
          <i class="el-icon-share"></i> 分享
        </li>
        <li class="right-menu-item" @click="rightMenu.isShow = false" v-if="downloadBtnShow">
          <a
            target="_blank"
            style="display: block; color: inherit"
            :href="getDownloadFilePath(selectedFile)"
            :download="selectedFile.fileName + '.' + selectedFile.extendName"
          >
            <i class="el-icon-download"></i> 下载
          </a>
        </li>
        <!-- 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 3-手动选择解压目录 -->
        <li class="right-menu-item unzip-menu-item" v-if="unzipBtnShow">
          <i class="el-icon-files"></i> 解压缩 <i class="el-icon-arrow-right"></i>
          <ul class="unzip-list" :style="`top: ${unzipMenu.top};bottom: ${unzipMenu.bottom};left: ${unzipMenu.left};right: ${unzipMenu.right};`">
            <li class="unzip-item" @click="handleUnzipFileBtnClick(selectedFile, 0)" v-if="unzipBtnShow">
              <i class="el-icon-files"></i> 解压到当前文件夹
            </li>
            <li class="unzip-item" @click="handleUnzipFileBtnClick(selectedFile, 1)" v-if="unzipBtnShow" :title='`解压到"${selectedFile.fileName}"`'>
              <i class="el-icon-files"></i> 解压到"{{selectedFile.fileName}}"
            </li>
          </ul>
        </li>
        <li class="right-menu-item" @click="getFileOnlineEditPathByOffice(selectedFile)" v-if="onlineEditBtnShow">
          <i class="el-icon-edit"></i> 在线编辑
        </li>
        <li
          class="right-menu-item"
          @click="copyShareLink(selectedFile.shareBatchNum, selectedFile.extractionCode)"
          v-if="copyLinkBtnShow"
        >
          <i class="el-icon-edit"></i> 复制链接
        </li>
      </ul>
    </transition>
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
      officeFileType: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
      downloadFilePath: '',
      viewFilePath: '',
      // 音频预览
      audioObj: {
        src: ''
      },
      sortedFileList: [], //  排序后的表格数据
      // 右键菜单
      rightMenu: {
        isShow: false,
        top: 0,
        left: 0,
        bottom: 'auto',
        right: 'auto'
      },
      // 右键解压缩菜单
      unzipMenu: {
        top: 0,
        bottom: 'auto',
        left: '138px',
        right: 'auto'
      },
      selectedFile: {} //  右键选中的表格行数据
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
    // 路由名称
    routeName() {
      return this.$route.name
    },
    // 查看按钮是否显示
    seeBtnShow() {
      return this.fileType !== 6
    },
    // 删除按钮是否显示
    deleteBtnShow() {
      return !['Share', 'MyShare'].includes(this.routeName)
    },
    // 还原按钮是否显示
    restoreBtnShow() {
      return this.fileType === 6 && !['Share', 'MyShare'].includes(this.routeName)
    },
    // 移动按钮是否显示
    moveBtnShow() {
      return this.fileType !== 6 && !['Share', 'MyShare'].includes(this.routeName)
    },
    // 重命名按钮是否显示
    renameBtnShow() {
      return this.fileType !== 6 && !['Share', 'MyShare'].includes(this.routeName)
    },
    // 删除按钮是否显示
    shareBtnShow() {
      return this.fileType !== 6 && !['Share', 'MyShare'].includes(this.routeName)
    },
    // 下载按钮是否显示
    downloadBtnShow() {
      return this.fileType !== 6 && !['MyShare'].includes(this.routeName)
    },
    // 解压缩按钮是否显示
    unzipBtnShow() {
      return (
        this.fileType !== 6 &&
        !['Share', 'MyShare'].includes(this.routeName) &&
        ['zip', 'rar'].includes(this.selectedFile.extendName)
      )
    },
    // 在线编辑按钮是否显示
    onlineEditBtnShow() {
      return (
        this.fileType !== 6 &&
        this.officeFileType.includes(this.selectedFile.extendName) &&
        !['Share', 'MyShare'].includes(this.routeName)
      )
    },
    // 复制链接按钮是否显示
    copyLinkBtnShow() {
      return this.routeName === 'MyShare'
    }
  },
  watch: {
    /**
     * 文件路径变化时清空表格已选行
     */
    filePath() {
      this.clearSelectedTable()
      this.$refs.multipleTable.clearSort()
    },
    /**
     * 文件类型变化时清空表格已选行
     */
    fileType() {
      this.clearSelectedTable()
      this.$refs.multipleTable.clearSort()
    },
    /**
     * 文件列表变化时清空表格已选行
     */
    fileList() {
      this.clearSelectedTable()
      this.$refs.multipleTable.clearSort()
      this.sortedFileList = this.fileList
    },
    /**
     * 监听右键列表状态
     * @description 右键列表打开时，body 添加点击事件的监听
     */
    'rightMenu.isShow'(newValue) {
      if (newValue) {
        document.body.addEventListener('click', this.closeRightMenu)
      } else {
        document.body.removeEventListener('click', this.closeRightMenu)
      }
    }
  },
  methods: {
    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     */
    handleSortChange() {
      this.sortedFileList = this.$refs.multipleTable.tableData
    },
    /**
     * 表格某一行右键事件
     */
    handleContextMenu(row, column, event) {
      event.preventDefault()
      this.$refs.multipleTable.setCurrentRow(row)
      this.selectedFile = row
      // 纵坐标设置
      if (
        document.body.clientHeight - event.clientY <
        document.querySelectorAll('#rightMenuList > .right-menu-item').length * 36 + 10
      ) {
        // 如果到底部的距离小于元素总高度
        this.rightMenu.top = 'auto'
        this.rightMenu.bottom = `${document.body.clientHeight - event.clientY}px`
        this.unzipMenu.top = 'auto'
        this.unzipMenu.bottom = '0px'
      } else {
        this.rightMenu.top = `${event.clientY}px`
        this.rightMenu.bottom = 'auto'
        this.unzipMenu.top = '0px'
        this.unzipMenu.bottom = 'auto'
      }
      // 横坐标设置
      if (document.body.clientWidth - event.clientX < 138) {
        // 如果到右边的距离小于元素总宽度
        this.rightMenu.left = 'auto'
        this.rightMenu.right = `${document.body.clientWidth - event.clientX}px`
        this.unzipMenu.left = '-200px'
        this.unzipMenu.right = 'auto'
      } else {
        this.rightMenu.left = `${event.clientX + 8}px`
        this.rightMenu.right = 'auto'
        this.unzipMenu.left = '138px'
        this.unzipMenu.right = 'auto'
      }
      this.rightMenu.isShow = true
    },
    /**
     * 关闭右键列表
     */
    closeRightMenu() {
      this.rightMenu.isShow = false
      this.$refs.multipleTable.setCurrentRow()
    },
    /**
     * 清空表格已选行
     * @description 用于父组件调用 | 本组件调用，请勿删除
     */
    clearSelectedTable() {
      this.$refs.multipleTable.clearSelection()
      this.$emit('setSelectionFile', [])
    },
    /**
     * 根据文件扩展名设置文件图片
     * @param {object} row 文件信息
     */
    setFileImg(row) {
      if (row.isDir === 1) {
        //  文件夹
        return this.fileImgMap.dir
      } else if (!this.fileImgTypeList.includes(row.extendName)) {
        //  无法识别文件类型的文件
        return this.fileImgMap.unknown
      } else if (this.fileType !== 6 && ['jpg', 'png', 'jpeg', 'gif', 'mp4'].includes(row.extendName)) {
        // 图片类型，直接显示缩略图
        return this.getImgMinPath(row)
      } else {
        //  可以识别文件类型的文件
        return this.fileImgMap[row.extendName]
      }
    },
    /**
     * 获取文件分享过期状态
     */
    getFileShareStatus(time) {
      if (new Date(time).getTime() > new Date().getTime()) {
        return false
      } else {
        return true
      }
    },
    /**
     * 文件名点击事件
     * @description 若当前点击的为文件夹，则进入文件夹内部；若是文件，则进行相应的预览。
     * @param {object} row 文件信息
     */
    handleFileNameClick(row, activeIndex) {
      // 若是目录则进入目录
      if (row.isDir) {
        if (this.routeName === 'Share') {
          // 当前是查看他人分享列表的页面
          this.$router.push({
            query: {
              filePath: row.shareFilePath + row.fileName + '/'
            }
          })
        } else if (this.routeName === 'MyShare') {
          // 当前是我的已分享列表页面
          this.$router.push({
            query: {
              filePath: row.shareFilePath + row.fileName + '/',
              shareBatchNum: row.shareBatchNum
            }
          })
        } else {
          // 网盘页面
          this.$router.push({
            query: {
              filePath: row.filePath + row.fileName + '/',
              fileType: 0
            }
          })
        }
      }
      // 若是文件，则进行相应的预览
      else {
        // 若当前点击项是图片
        const PIC = ['png', 'jpg', 'jpeg', 'gif', 'svg']
        if (PIC.includes(row.extendName)) {
          if (this.fileType === 1) {
            //  图片分类下 - 大图查看
            let data = {
              imgPreviewVisible: true,
              imgPreviewList: this.sortedFileList.map((item) => {
                return {
                  fileUrl: this.getViewFilePath(item),
                  downloadLink: this.getDownloadFilePath(item),
                  fileName: item.fileName,
                  extendName: item.extendName
                }
              }),
              activeIndex: activeIndex
            }
            this.$store.commit('setImgPreviewData', data)
          } else {
            //  非图片分类下 - 大图查看
            let data = {
              imgPreviewVisible: true,
              imgPreviewList: [
                {
                  fileUrl: this.getViewFilePath(row),
                  downloadLink: this.getDownloadFilePath(row),
                  fileName: row.fileName,
                  extendName: row.extendName
                }
              ],
              activeIndex: 0
            }
            this.$store.commit('setImgPreviewData', data)
          }
        }
        //  若当前点击项是可以使用office在线预览的
        if ([...this.officeFileType, 'pdf'].includes(row.extendName)) {
          this.getFileOnlineViewPathByOffice(row)
        }
        //  若当前点击项是代码或文本文件
        const CODE = ['html', 'js', 'css', 'json', 'c', 'java', 'txt']
        if (CODE.includes(row.extendName)) {
          window.open(this.getViewFilePath(row), '_blank')
        }
        //  若当前点击项是视频mp4格式
        const VIDEO = ['mp4']
        if (VIDEO.includes(row.extendName)) {
          if (this.fileType === 3) {
            // 视频分类下 加载播放列表
            let data = {
              videoPreviewVisible: true,
              videoPreviewList: this.sortedFileList.map((item) => {
                return {
                  ...item,
                  fileUrl: this.getViewFilePath(item),
                  downloadLink: this.getDownloadFilePath(item),
                  fileName: item.fileName,
                  extendName: item.extendName
                }
              }),
              activeIndex: activeIndex
            }
            this.$store.commit('setVideoPreviewData', data)
          } else {
            // 非视频分类下 - 单个视频预览
            let data = {
              videoPreviewVisible: true,
              videoPreviewList: [
                {
                  ...row,
                  fileUrl: this.getViewFilePath(row),
                  downloadLink: this.getDownloadFilePath(row),
                  fileName: row.fileName,
                  extendName: row.extendName
                }
              ],
              activeIndex: 0
            }
            this.$store.commit('setVideoPreviewData', data)
          }
        }
        //  若当前点击项是音频mp3格式
        const AUDIO = ['mp3']
        if (AUDIO.includes(row.extendName)) {
          if (this.audioObj.src !== this.getViewFilePath(row)) {
            this.$notify.closeAll()
            this.audioObj.src = this.getViewFilePath(row)
            this.$notify({
              title: `${row.fileName}.${row.extendName}`,
              dangerouslyUseHTMLString: true,
              message: `<audio class="audio-preview" src="${
                this.audioObj.src
              }" controls autoplay style="padding-right: 16px; margin-top: 16px;"></audio>`,
              duration: 0, //  不自动关闭
              offset: 100,
              onClose: () => {
                this.audioObj.src = ''
              }
            })
          }
        }
      }
    },
    /**
     * 表格选择项发生变化时的回调函数
     * @param {[]} selection 勾选的行数据
     */
    handleSelectRow(selection) {
      this.$emit('setSelectionFile', selection, selection.length !== 0)
    },
    /**
     * 移动按钮点击事件
     * @description 向父组件传递当前操作的文件信息，并打开“移动文件对话框”
     * @param {object} fileInfo 文件信息
     */
    handleMoveFileBtnClick(fileInfo) {
      this.$emit('setOperationFile', fileInfo)
      //  第一个参数: 是否批量移动；第二个参数：打开/关闭移动文件对话框
      this.$emit('setMoveFileDialogData', false, true)
    },
    /**
     * 解压缩按钮点击事件
     * @description 调用解压缩文件接口，并展示新的文件列表
     * @param {object} fileInfo 文件信息
     * @param {number} unzipMode 解压模式 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 2-手动选择解压目录
     */
    handleUnzipFileBtnClick(fileInfo, unzipMode) {
      if(unzipMode === 0 || unzipMode === 1) {
        const loading = this.$loading({
          lock: true,
          text: '正在解压缩，请稍等片刻...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        unzipFile({
          unzipMode: unzipMode,
          userFileId: fileInfo.userFileId
        }).then((res) => {
          if (res.success) {
            this.$emit('getTableDataByType')
            this.$store.dispatch('showStorage')
            this.$message.success('解压成功')
            loading.close()
          } else {
            this.$message.error(res.message)
          }
        })
      } else if(unzipMode === 2) {
        this.$emit('setOperationFile', fileInfo)
        //  第一个参数: 是否批量移动；第二个参数：打开/关闭移动文件对话框
        this.$emit('setMoveFileDialogData', false, true)
      }
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
    },
    /**
     * 文件分享按钮点击事件
     * @description 打开对话框让用户选择过期时间和提取码
     * @param {object} fileInfo 文件信息
     */
    handleShareFileBtnClick(fileInfo) {
      this.$emit('setSelectionFile', [fileInfo])
      this.$emit('setShareFileDialogData')
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

  .file-table.share {
    height: calc(100vh - 109px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 161px) !important;
    }
  }

  .file-table.my-share {
    height: calc(100vh - 157px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 209px) !important;
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

      .el-icon-warning {
        font-size: 16px;
        color: $Warning;
      }

      .el-icon-time {
        font-size: 16px;
        color: $Success;
      }
    }
  }
}
.right-menu-list {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid $BorderLighter;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 4px 0;
  color: $RegularText;

  .right-menu-item,
  .unzip-item {
    padding: 0 16px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    &:hover {
      background: $PrimaryHover;
      color: $Primary;
    }
    i {
      margin-right: 8px;
    }
  }

  .unzip-menu-item {
    position: relative;
    &:hover {
      .unzip-list {
        display: block;
      }
    }
    .unzip-list {
      position: absolute;
      display: none;
      .unzip-item {
        width: 200px;
        setEllipsis(1)
      }
    }
  }
}
.right-menu-list,
.unzip-list {
  background: #fff;
  border: 1px solid $BorderLighter;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 4px 0;
  color: $RegularText;
}
</style>
