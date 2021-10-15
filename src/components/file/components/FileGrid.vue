<template>
	<!-- 文件平铺 -->
	<div class="file-grid-wrapper">
		<ul
			class="file-list"
			v-loading="loading"
			element-loading-text="文件加载中……"
			@click.self="rightMenu.isShow = false"
			@scroll="rightMenu.isShow = false"
		>
			<li
				class="file-item"
				v-for="(item, index) in fileListSorted"
				:key="index"
				:title="item | fileNameComplete"
				:style="`width: ${gridSize + 40}px; `"
				:class="item.userFileId === selectedFile.userFileId ? 'active' : ''"
				@click="handleFileNameClick(item, index, fileListSorted)"
				@contextmenu.prevent="handleContextMenu(item, index, $event)"
			>
				<img
					class="file-img"
					:src="setFileImg(item)"
					:style="`width: ${gridSize}px; height: ${gridSize}px;`"
				/>
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
			<ul
				class="right-menu-list"
				id="rightMenuList"
				v-show="rightMenu.isShow"
				:style="`top: ${rightMenu.top};right: ${rightMenu.right};bottom: ${rightMenu.bottom};left: ${rightMenu.left};`"
			>
				<li
					class="right-menu-item"
					@click="
						handleFileNameClick(selectedFile, selectedIndex, fileListSorted)
					"
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
					@click="rightMenu.isShow = false"
					v-if="downloadBtnShow"
				>
					<a
						target="_blank"
						style="display: block; color: inherit"
						:href="getDownloadFilePath(selectedFile)"
						:download="selectedFile.fileName + '.' + selectedFile.extendName"
					>
						<i class="el-icon-download"></i> 下载
					</a>
				</li>
				<li
					class="right-menu-item"
					@click="handleUnzipFileBtnClick(selectedFile)"
					v-if="unzipBtnShow"
				>
					<i class="el-icon-files"></i> 解压缩
				</li>
				<li
					class="right-menu-item"
					@click="getFileOnlineEditPathByOffice(selectedFile)"
					v-if="onlineEditBtnShow"
				>
					<i class="el-icon-edit"></i> 在线编辑
				</li>
				<li
					class="right-menu-item"
					@click="
						copyShareLink(
							selectedFile.shareBatchNum,
							selectedFile.extractionCode
						)
					"
					v-if="copyLinkBtnShow"
				>
					<i class="el-icon-edit"></i> 复制链接
				</li>
			</ul>
		</transition>
	</div>
</template>

<script>
import {
	unzipFile,
	deleteFile,
	renameFile,
	deleteRecoveryFile,
	restoreRecoveryFile
} from '_r/file.js'
import { mapGetters } from 'vuex'
import 'element-ui/lib/theme-chalk/base.css'

export default {
	name: 'FileGrid',
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
		fileList: Array, //  文件列表
		loading: Boolean,
		batchOperate: Boolean
	},
	data() {
		return {
			fileListSorted: [],
			officeFileType: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
			downloadFilePath: '',
			viewFilePath: '',
			// 右键菜单
			rightMenu: {
				isShow: false,
				top: 0,
				left: 0
			},
			selectedFile: {},
			selectedIndex: 0,
			// 音频预览
			audioObj: {
				src: ''
			}
		}
	},
	computed: {
		/**
		 * selectedColumnList: 列显隐
		 * fileModel: 文件查看模式 0列表模式 1网格模式
		 *  */
		...mapGetters(['selectedColumnList', 'fileModel']),
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
		},
		// 图标大小
		gridSize() {
			return this.$store.getters.gridSize
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
				['zip', 'rar'].includes(this.selectedFile.extendName)
			)
		},
		// 在线编辑按钮是否显示
		onlineEditBtnShow() {
			return (
				![6, 8].includes(this.fileType) &&
				this.officeFileType.includes(this.selectedFile.extendName) &&
				!['Share'].includes(this.routeName)
			)
		},
		// 复制链接按钮是否显示
		copyLinkBtnShow() {
			return this.fileType === 8
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
			this.$emit('setSelectionFile', newValue, this.batchOperate)
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
		 * 文件鼠标右键事件
		 * @param {object} item 文件信息
		 * @param {number} index 文件索引
		 * @param {object} event 鼠标事件信息
		 */
		handleContextMenu(item, index, event) {
			if (!this.batchOperate) {
				event.preventDefault()
				this.selectedFile = item
				this.selectedIndex = index
				// 纵坐标设置
				if (
					document.body.clientHeight - event.clientY <
					document.querySelectorAll('#rightMenuList > .right-menu-item')
						.length *
						36 +
						10
				) {
					// 如果到底部的距离小于元素总高度
					this.rightMenu.top = 'auto'
					this.rightMenu.bottom = `${
						document.body.clientHeight - event.clientY
					}px`
				} else {
					this.rightMenu.top = `${event.clientY}px`
					this.rightMenu.bottom = 'auto'
				}
				// 横坐标设置
				if (document.body.clientWidth - event.clientX < 120) {
					// 如果到右边的距离小于元素总宽度
					this.rightMenu.left = 'auto'
					this.rightMenu.right = `${
						document.body.clientWidth - event.clientX
					}px`
				} else {
					this.rightMenu.left = `${event.clientX + 8}px`
					this.rightMenu.right = 'auto'
				}
				this.rightMenu.isShow = true
			}
		},
		/**
		 * 关闭右键列表
		 */
		closeRightMenu() {
			this.rightMenu.isShow = false
			this.selectedFile = {}
		},

		/**
		 * 文件名点击事件
		 * @description 若当前点击的为文件夹，则进入文件夹内部；若是文件，则进行相应的预览。
		 * @param {object} row 文件信息
		 * @param {number} activeIndex 文件索引
		 * @param {[]} fileList 文件列表
		 */
		handleFileNameClick(row, activeIndex, fileList) {
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
					if (this.fileType === 1) {
						//  图片分类下 - 大图查看
						let data = {
							imgPreviewVisible: true,
							imgPreviewList: fileList.map((item) => {
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
							videoPreviewList: fileList.map((item) => {
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
							message: `<audio class="audio-preview" src="${this.audioObj.src}" controls autoplay style="padding-right: 16px; margin-top: 16px;"></audio>`,
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
		 * 移动按钮点击事件
		 * @description 向父组件传递当前操作的文件信息，并打开“移动文件对话框”
		 * @param {object} file 文件信息
		 */
		handleMoveFileBtnClick(file) {
			this.rightMenu.isShow = false
			this.$emit('setOperationFile', file)
			//  第一个参数: 是否批量移动；第二个参数：打开/关闭移动文件模态框
			this.$emit('setMoveFileDialogData', false, true)
		},
		/**
		 * 解压缩按钮点击事件
		 * @description 调用解压缩文件接口，并展示新的文件列表
		 * @param {object} fileInfo 文件信息
		 */
		handleUnzipFileBtnClick(fileInfo) {
			this.rightMenu.isShow = false
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
					.catch(() => {})
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
					.catch(() => {})
			}
		},
		/**
		 * 删除文件确认对话框 | 确定按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
		 * @param {object} fileInfo 文件信息
		 * @param {boolean} type 文件类型，true 在回收站中彻底删除 false 删除到回收站
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
			this.rightMenu.isShow = false
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
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.file-grid-wrapper {
  border-top: 1px solid $BorderBase;

  .file-list {
    height: calc(100vh - 206px);
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    setScrollbar(6px, transparent, #C0C4CC);

    .file-item {
      margin: 0 16px 16px 0;
      position: relative;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      z-index: 1;

      &:hover {
        background: $tabBackColor;

        .file-name {
          font-weight: 550;
        }
      }

      .file-name {
        margin-top: 8px;
        height: 44px;
        line-height: 22px;
        font-size: 12px;
        word-break: break-all;
        setEllipsis(2);
      }

      .file-checked-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        background: rgba(245, 247, 250, 0.5);
        width: 100%;
        height: 100%;

        .file-checked {
          position: absolute;
          top: 16px;
          left: 24px;
        }
      }

      .file-checked-wrapper.checked {
        background: rgba(245, 247, 250, 0);
      }
    }
    .file-item.active {
      background: $tabBackColor;
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

    .right-menu-item {
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
  }
}
</style>
