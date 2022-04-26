<template>
	<!-- 右键列表 -->
	<transition name="el-fade-in-linear">
		<!-- 在某个文件上右键 -->
		<ul
			class="right-menu-list"
			id="rightMenuList"
			v-show="visible"
			v-if="selectedFile !== undefined"
			:style="`top: ${rightMenu.top};right: ${rightMenu.right};bottom: ${rightMenu.bottom};left: ${rightMenu.left};`"
		>
			<li
				class="right-menu-item"
				@click="$file.handleFileNameClick(selectedFile, 0, [selectedFile])"
				v-if="seeBtnShow"
			>
				<i class="el-icon-view"></i> 查看
			</li>
			<li
				class="right-menu-item"
				@click="handleDeleteFileBtnClick(selectedFile)"
				v-if="deleteBtnShow"
			>
				<i class="el-icon-delete"></i> 删除
			</li>
			<li
				class="right-menu-item"
				@click="handleRestoreFileBtnClick(selectedFile)"
				v-if="restoreBtnShow"
			>
				<i class="el-icon-refresh-left"></i> 还原
			</li>
			<li
				class="right-menu-item"
				@click="handleCopyFileBtnClick(selectedFile)"
				v-if="copyBtnShow"
			>
				<i class="el-icon-copy-document"></i> 复制到
			</li>
			<li
				class="right-menu-item"
				@click="handleMoveFileBtnClick(selectedFile)"
				v-if="moveBtnShow"
			>
				<i class="el-icon-s-promotion"></i> 移动
			</li>
			<li
				class="right-menu-item"
				@click="handleRenameFileBtnClick(selectedFile)"
				v-if="renameBtnShow"
			>
				<i class="el-icon-edit-outline"></i> 重命名
			</li>
			<li
				class="right-menu-item"
				@click="handleShareFileBtnClick(selectedFile)"
				v-if="shareBtnShow"
			>
				<i class="el-icon-share"></i> 分享
			</li>
			<li
				class="right-menu-item"
				@click="visible = false"
				v-if="downloadBtnShow"
			>
				<a
					target="_blank"
					style="display: block; color: inherit"
					:href="$file.getDownloadFilePath(selectedFile)"
					:download="selectedFile.fileName + '.' + selectedFile.extendName"
				>
					<i class="el-icon-download"></i> 下载
				</a>
			</li>
			<!-- 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 3-手动选择解压目录 -->
			<li class="right-menu-item unzip-menu-item" v-if="unzipBtnShow">
				<i class="el-icon-files"></i> 解压缩
				<i class="el-icon-arrow-right"></i>
				<ul
					class="unzip-list"
					:style="`top: ${unzipMenu.top};bottom: ${unzipMenu.bottom};left: ${unzipMenu.left};right: ${unzipMenu.right};`"
				>
					<li
						class="unzip-item"
						@click="handleUnzipFileBtnClick(selectedFile, 0)"
					>
						<i class="el-icon-files"></i> 解压到当前文件夹
					</li>
					<li
						class="unzip-item"
						@click="handleUnzipFileBtnClick(selectedFile, 1)"
						:title="`解压到&quot;${selectedFile.fileName}&quot;`"
					>
						<i class="el-icon-files"></i> 解压到"{{ selectedFile.fileName }}"
					</li>
					<li
						class="unzip-item"
						@click="handleUnzipFileBtnClick(selectedFile, 2)"
					>
						<i class="el-icon-files"></i> 解压到目标文件夹
					</li>
				</ul>
			</li>
			<!-- <li
				class="right-menu-item"
				@click="handleClickFolderEdit"
				v-if="folderEditBtnShow"
			>
				<i class="el-icon-edit"></i> 编辑文件夹
			</li> -->
			<li
				class="right-menu-item"
				@click="handleClickFileEdit(selectedFile)"
				v-if="onlineEditBtnShow"
			>
				<i class="el-icon-edit"></i> 在线编辑
			</li>
			<li
				class="right-menu-item"
				@click="
					$file.copyShareLink(
						selectedFile.shareBatchNum,
						selectedFile.extractionCode
					)
				"
				v-if="copyLinkBtnShow"
			>
				<i class="el-icon-edit"></i> 复制链接
			</li>
			<li
				class="right-menu-item"
				@click="handleShowDetailInfo(selectedFile)"
				v-if="detailInfoBtnShow"
			>
				<i class="el-icon-document"></i> 文件详情
			</li>
		</ul>
		<!-- 在空白处右键，右键列表展示新建文件夹、新建文件等操作按钮 -->
		<ul
			class="right-menu-list add"
			id="rightMenuList"
			v-show="visible"
			v-else
			:style="`top: ${rightMenu.top};right: ${rightMenu.right};bottom: ${rightMenu.bottom};left: ${rightMenu.left};`"
		>
			<li class="right-menu-item" @click="callback('confirm')">
				<i class="el-icon-refresh"></i> 刷新
			</li>
			<template v-if="fileType === 0">
				<el-divider />
				<li class="right-menu-item" @click="handleClickAddFolderBtn">
					<i class="el-icon-folder-add"></i> 新建文件夹
				</li>
				<li class="right-menu-item" @click="handleCreateFile('docx')">
					<img :src="wordImg" />新建 Word 文档
				</li>
				<li class="right-menu-item" @click="handleCreateFile('xlsx')">
					<img :src="excelImg" />新建 Excel 工作表
				</li>
				<li class="right-menu-item" @click="handleCreateFile('pptx')">
					<img :src="pptImg" />新建 PPT 演示文稿
				</li>
				<el-divider />
				<li class="right-menu-item" @click="handleUploadFileBtnClick(1)">
					<i class="el-icon-upload2"></i> 上传文件
				</li>
				<li class="right-menu-item" @click="handleUploadFileBtnClick(2)">
					<i class="el-icon-folder-opened"></i> 上传文件夹
				</li>
				<li class="right-menu-item" @click="handleUploadFileBtnClick(3)">
					<i class="el-icon-thumb"></i> 拖拽上传
				</li>
			</template>
		</ul>
	</transition>
</template>

<script>
import router from '@/router/router.js'
import {
	officeFileType,
	fileSuffixCodeModeMap,
	markdownFileType
} from '@/libs/map.js'

export default {
	name: 'ContextMenu',
	data() {
		return {
			officeFileType,
			fileSuffixCodeModeMap,
			markdownFileType,
			visible: false, //  右键菜单是否显示
			sortedFileList: [], //  排序后的表格数据
			// 右键菜单
			rightMenu: {
				top: 0,
				left: 0,
				bottom: 'auto',
				right: 'auto'
			},
			// 右键解压缩菜单
			unzipMenu: {
				top: 0,
				bottom: 'auto',
				left: '126px',
				right: 'auto'
			},
			dirImg: require('_a/images/file/dir.png'),
			wordImg: require('_a/images/file/file_word.svg'),
			excelImg: require('_a/images/file/file_excel.svg'),
			pptImg: require('_a/images/file/file_ppt.svg')
		}
	},
	computed: {
		// 路由名称
		routeName() {
			return router.currentRoute.name
		},
		// 左侧菜单选中的文件类型
		fileType() {
			return router.currentRoute.query.fileType
				? Number(router.currentRoute.query.fileType)
				: 0
		},
		// 当前路径
		filePath() {
			return router.currentRoute.query.filePath
		},
		// 查看按钮是否显示
		seeBtnShow() {
			return this.fileType !== 6
		},
		// 删除按钮是否显示
		deleteBtnShow() {
			return this.fileType !== 8 && !['Share'].includes(this.routeName)
		},
		// 还原按钮是否显示
		restoreBtnShow() {
			return this.fileType === 6 && !['Share'].includes(this.routeName)
		},
		// 复制按钮是否显示
		copyBtnShow() {
			return (
				![6, 8].includes(this.fileType) && !['Share'].includes(this.routeName)
			)
		},
		// 移动按钮是否显示
		moveBtnShow() {
			return (
				![6, 8].includes(this.fileType) && !['Share'].includes(this.routeName)
			)
		},
		// 重命名按钮是否显示
		renameBtnShow() {
			return (
				![6, 8].includes(this.fileType) && !['Share'].includes(this.routeName)
			)
		},
		// 分享按钮是否显示
		shareBtnShow() {
			return (
				![6, 8].includes(this.fileType) && !['Share'].includes(this.routeName)
			)
		},
		// 下载按钮是否显示
		downloadBtnShow() {
			return ![6, 8].includes(this.fileType)
		},
		// 解压缩按钮是否显示
		unzipBtnShow() {
			return (
				![6, 8].includes(this.fileType) &&
				!['Share'].includes(this.routeName) &&
				['zip', 'rar', '7z', 'tar', 'gz'].includes(this.selectedFile.extendName)
			)
		},
		// 编辑文件夹按钮是否显示
		folderEditBtnShow() {
			return (
				![6, 8].includes(this.fileType) &&
				this.selectedFile.isDir === 1 &&
				!['Share'].includes(this.routeName)
			)
		},
		// 在线编辑按钮是否显示
		onlineEditBtnShow() {
			return (
				![6, 8].includes(this.fileType) &&
				(this.officeFileType.includes(this.selectedFile.extendName) ||
					this.markdownFileType.includes(this.selectedFile.extendName) ||
					this.fileSuffixCodeModeMap.has(this.selectedFile.extendName)) &&
				!['Share'].includes(this.routeName)
			)
		},
		// 复制链接按钮是否显示
		copyLinkBtnShow() {
			return this.fileType === 8
		},
		// 文件详情按钮是否显示
		detailInfoBtnShow() {
			return true
		},
		// 上传文件组件参数
		uploadFileParams() {
			return {
				filePath: this.filePath,
				isDir: 0
			}
		}
	},
	watch: {
		/**
		 * 监听右键列表状态
		 * @description 右键列表打开时，body 添加点击事件的监听
		 */
		visible(newValue) {
			if (newValue === true) {
				document.body.addEventListener('click', this.closeRightMenu)
				this.handleOpenContextMenu()
			} else {
				document.body.removeEventListener('click', this.closeRightMenu)
			}
		}
	},
	methods: {
		/**
		 * 打开右键菜单
		 */
		handleOpenContextMenu() {
			// 纵坐标设置
			if (
				document.body.clientHeight - this.domEvent.clientY <
				document.querySelectorAll('#rightMenuList > .right-menu-item').length *
					36 +
					10
			) {
				// 如果到底部的距离小于元素总高度
				this.rightMenu.top = 'auto'
				this.rightMenu.bottom = `${
					document.body.clientHeight - this.domEvent.clientY
				}px`
				this.unzipMenu.top = 'auto'
				this.unzipMenu.bottom = '0px'
			} else {
				this.rightMenu.top = `${this.domEvent.clientY}px`
				this.rightMenu.bottom = 'auto'
				this.unzipMenu.top = '0px'
				this.unzipMenu.bottom = 'auto'
			}
			// 横坐标设置
			if (document.body.clientWidth - this.domEvent.clientX < 138) {
				// 如果到右边的距离小于元素总宽度
				this.rightMenu.left = 'auto'
				this.rightMenu.right = `${
					document.body.clientWidth - this.domEvent.clientX
				}px`
				this.unzipMenu.left = '-200px'
				this.unzipMenu.right = 'auto'
			} else {
				this.rightMenu.left = `${this.domEvent.clientX + 8}px`
				this.rightMenu.right = 'auto'
				this.unzipMenu.left = '126px'
				this.unzipMenu.right = 'auto'
			}
			this.visible = true
		},
		/**
		 * 关闭右键列表
		 */
		closeRightMenu(event) {
			if (
				!event.target.className.includes('operate-more-') &&
				!event.target.className.includes('unzip-menu-item')
			) {
				this.visible = false
				if (this.selectedFile !== undefined) {
					// 不是在空白处右键时
					this.callback('cancel')
				}
			}
		},
		/**
		 * 复制按钮点击事件
		 * @description 向父组件传递当前操作的文件信息，并打开“复制文件对话框”
		 * @param {object} fileInfo 文件信息
		 */
		handleCopyFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog
				.copyFile({
					fileInfo
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 移动按钮点击事件
		 * @description 向父组件传递当前操作的文件信息，并打开“移动文件对话框”
		 * @param {object} fileInfo 文件信息
		 */
		handleMoveFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog
				.moveFile({
					isBatchMove: false,
					fileInfo
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 解压缩按钮点击事件
		 * @description 调用解压缩文件接口，并展示新的文件列表
		 * @param {object} fileInfo 文件信息
		 * @param {number} unzipMode 解压模式 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 2-手动选择解压目录
		 */
		handleUnzipFileBtnClick(fileInfo, unzipMode) {
			this.visible = false
			this.$openDialog
				.unzipFile({
					unzipMode: unzipMode,
					userFileId: fileInfo.userFileId
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 删除按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，打开确认对话框
		 * @param {object} fileInfo 文件信息
		 */
		handleDeleteFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog
				.deleteFile({
					isBatchOperation: false,
					fileInfo,
					deleteMode: this.fileType === 6 ? 2 : 1 //  删除类型：1-删除到回收站 2-彻底删除
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 还原按钮点击事件
		 * @description 调用接口，在回收站中还原文件
		 * @param {object} fileInfo 文件信息
		 */
		handleRestoreFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog
				.restoreFile({
					deleteBatchNum: fileInfo.deleteBatchNum,
					filePath: fileInfo.filePath
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 文件重命名按钮点击事件
		 * @description 打开确认对话框让用户输入新的文件名
		 * @param {object} fileInfo 文件信息
		 */
		handleRenameFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog
				.renameFile({
					oldFileName: fileInfo.fileName,
					userFileId: fileInfo.userFileId
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 文件分享按钮点击事件
		 * @description 打开对话框让用户选择过期时间和提取码
		 * @param {object} fileInfo 文件信息
		 */
		handleShareFileBtnClick(fileInfo) {
			this.visible = false
			this.$openDialog.shareFile({
				fileInfo: [
					{
						userFileId: fileInfo.userFileId
					}
				]
			})
		},
		/**
		 * 编辑文件夹按钮点击事件
		 */
		handleClickFolderEdit() {
			router.push({
				name: 'WebIDE',
				query: { filePath: this.selectedFile.filePath }
			})
		},
		/**
		 * 文件在线编辑按钮点击事件
		 * @description 打开 代码预览对话框 或 office 编辑页面
		 * @param {object} fileInfo 文件信息
		 */
		handleClickFileEdit(fileInfo) {
			if (this.officeFileType.includes(fileInfo.extendName)) {
				// office 编辑页面
				this.$file.getFileOnlineEditPathByOffice(fileInfo)
			} else if (this.markdownFileType.includes(fileInfo.extendName)) {
				// markdown 编辑浮层
				this.$openBox.markdownPreview({
					fileInfo: fileInfo,
					editable: true
				})
			} else {
				// 代码编辑对话框
				this.$openBox.codePreview({ fileInfo: fileInfo, isEdit: true })
			}
		},
		/**
		 * 文件详情按钮点击事件
		 * @description 打开对话框展示文件完整信息
		 * @param {object} fileInfo 文件信息
		 */
		handleShowDetailInfo(fileInfo) {
			this.visible = false
			this.$openDialog.showFileDetail({ fileInfo })
		},
		/**
		 * 新建文件夹按钮点击事件
		 * @description 调用新建文件夹服务，并在弹窗确认回调事件中刷新文件列表
		 */
		handleClickAddFolderBtn() {
			this.$openDialog
				.addFolder({
					filePath: router.currentRoute.query.filePath || '/'
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 新建 office 文件
		 * @description 调用新建 office 文件服务，并在弹窗确认回调事件中刷新文件列表
		 * @param {string} 文件扩展名 docx xlsx pptx
		 */
		handleCreateFile(extendName) {
			this.$openDialog
				.addFile({
					extendName: extendName
				})
				.then((res) => {
					this.callback(res)
				})
		},
		/**
		 * 上传文件按钮点击事件
		 * @description 通过Bus通信，开启全局上传文件流程
		 * @param {boolean} uploadWay 上传方式 0-文件上传 1-文件夹上传 2-粘贴图片或拖拽上传
		 */
		handleUploadFileBtnClick(uploadWay) {
			this.$openBox.uploadFile({
				params: this.uploadFileParams,
				uploadWay,
				serviceEl: this.serviceEl,
				callType: true //  callType 调用此服务的方式：1 - 顶部栏，2 - 右键菜单
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

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
  list-style: none;

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

  &.add {
    .right-menu-item {
      display: flex;
      align-items: center;
      img {
        margin-right: 4px;
        height: 20px;
      }
      i {
        margin-right: 4px;
        font-size: 18px;
      }
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
      list-style: none;
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
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  padding: 8px 0;
  color: $RegularText;
  font-size: 14px;
  .el-divider {
    margin: 2px 0;
  }
}
</style>
