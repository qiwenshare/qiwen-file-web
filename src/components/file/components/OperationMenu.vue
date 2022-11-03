<template>
	<div
		class="operation-menu-wrapper"
		:class="'file-type-' + fileType"
		ref="operationMenuRef"
	>
		<el-button-group
			class="create-operate-group"
			v-if="(!selectedFiles.length || !isBatchOperation) && fileType === 0"
		>
			<el-dropdown class="upload-drop" trigger="hover">
				<el-button
					size="mini"
					type="primary"
					icon="el-icon-upload2"
					id="uploadFileId"
					>上传<i class="el-icon-arrow-down el-icon--right"></i
				></el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="handleUploadFileBtnClick(1)"
						>上传文件</el-dropdown-item
					>
					<el-dropdown-item @click.native="handleUploadFileBtnClick(2)"
						>上传文件夹</el-dropdown-item
					>
					<el-dropdown-item
						@click.native="handleUploadFileBtnClick(3)"
						title="截图粘贴或拖拽上传"
						:disabled="screenWidth <= 520"
						>拖拽上传</el-dropdown-item
					>
				</el-dropdown-menu>
			</el-dropdown>

			<el-dropdown class="create-drop" trigger="hover">
				<el-button
					size="mini"
					type="primary"
					icon="el-icon-plus"
					id="uploadFileId"
					>新建<i class="el-icon-arrow-down el-icon--right"></i
				></el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="handleClickAddFolderBtn">
						<div class="img-text-wrapper"><img :src="dirImg" /> 新建文件夹</div>
					</el-dropdown-item>
					<el-dropdown-item divided @click.native="handleCreateFile('docx')">
						<div class="img-text-wrapper"><img :src="wordImg" />Word 文档</div>
					</el-dropdown-item>
					<el-dropdown-item @click.native="handleCreateFile('xlsx')">
						<div class="img-text-wrapper">
							<img :src="excelImg" />Excel 工作表
						</div>
					</el-dropdown-item>
					<el-dropdown-item @click.native="handleCreateFile('pptx')">
						<div class="img-text-wrapper">
							<img :src="pptImg" />PPT 演示文稿
						</div>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</el-button-group>
		<div class="batch-operate-group">
			<el-button-group v-if="isBatchOperation">
				<el-button
					size="mini"
					type="primary"
					v-if="selectedFiles.length"
					icon="el-icon-delete"
					@click="handleBatchDeleteBtnClick"
					>批量删除</el-button
				>
				<el-button
					size="mini"
					type="primary"
					v-if="selectedFiles.length && !fileType && fileType !== 6"
					icon="el-icon-rank"
					@click="handleBatchMoveBtnClick"
					>批量移动</el-button
				>
				<el-button
					size="mini"
					type="primary"
					v-if="selectedFiles.length && fileType !== 6"
					icon="el-icon-download"
					@click="handleBatchDownloadBtnClick"
					>批量下载</el-button
				>
				<el-button
					size="mini"
					type="primary"
					v-if="
						selectedFiles.length && fileType !== 6 && $route.name !== 'Share'
					"
					icon="el-icon-share"
					@click="handleBatchShareBtnClick"
					>批量分享</el-button
				>
			</el-button-group>
		</div>

		<!-- 全局搜索文件 -->
		<el-input
			v-if="fileType === 0"
			class="select-file-input"
			v-model="searchFile.fileName"
			placeholder="搜索您的文件"
			size="mini"
			maxlength="255"
			:clearable="true"
			@change="handleSearchInputChange"
			@clear="$emit('getTableDataByType')"
			@keyup.enter.native="handleSearchInputChange(searchFile.fileName)"
		>
			<i
				slot="prefix"
				class="el-input__icon el-icon-search"
				title="点击搜索"
				@click="handleSearchInputChange(searchFile.fileName)"
			></i>
		</el-input>

		<!-- 批量操作 -->
		<i
			class="batch-icon el-icon-finished"
			:class="isBatchOperation ? 'active' : ''"
			:title="isBatchOperation ? '取消批量操作' : '批量操作'"
			v-if="fileModel === 1 && fileType !== 8"
			@click="handleBatchOperationChange()"
		></i>
		<i
			class="refresh-icon el-icon-refresh"
			title="刷新文件列表"
			@click="$emit('getTableDataByType')"
		></i>
		<el-divider direction="vertical"></el-divider>
		<template v-if="screenWidth > 768">
			<!-- 文件展示模式 -->
			<i
				class="model-icon iconfont icon-liebiao1"
				:class="{ active: fileGroupLable === 0 }"
				title="列表模式"
				@click="handleFileDisplayModelChange(0)"
			></i>
			<i
				class="model-icon el-icon-s-grid"
				:class="{ active: fileGroupLable === 1 }"
				title="网格模式"
				@click="handleFileDisplayModelChange(1)"
			></i>
			<i
				class="model-icon el-icon-date"
				:class="{ active: fileGroupLable === 2 }"
				title="时间线模式"
				v-if="fileType === 1"
				@click="handleFileDisplayModelChange(2)"
			></i>
			<el-divider direction="vertical"></el-divider>
		</template>

		<!-- 操作栏收纳 -->
		<el-popover
			v-model="operatePopoverVisible"
			placement="bottom"
			:trigger="screenWidth <= 768 ? 'manual' : 'hover'"
		>
			<i
				slot="reference"
				class="setting-icon el-icon-setting"
				@click="operatePopoverVisible = !operatePopoverVisible"
			></i>
			<!-- 选择表格列 -->
			<SelectColumn></SelectColumn>
			<!-- 文件展示模式 -->
			<div class="change-file-model" v-if="screenWidth <= 768">
				<div class="title">查看模式</div>
				<el-radio-group
					v-model="fileGroupLable"
					size="mini"
					@change="handleFileDisplayModelChange"
				>
					<el-radio-button :label="0">
						<i class="iconfont icon-liebiao1"></i> 列表
					</el-radio-button>
					<el-radio-button :label="1">
						<i class="el-icon-s-grid"></i> 网格
					</el-radio-button>
					<el-radio-button :label="2" v-if="fileType === 1">
						<i class="el-icon-date"></i> 时间线
					</el-radio-button>
				</el-radio-group>
			</div>
			<template v-if="fileGroupLable === 1 || fileGroupLable === 2">
				<el-divider class="split-line"></el-divider>
				<!-- 图标大小调整 -->
				<div class="change-grid-size">
					<div class="title">调整图标大小</div>
					<el-slider
						v-model="gridSize"
						:min="20"
						:max="150"
						:step="10"
						:format-tooltip="formatTooltip"
					></el-slider>
				</div>
			</template>
		</el-popover>

		<!-- 多选文件下载，页面隐藏 -->
		<a target="_blank" :href="batchDownloadLink" ref="batchDownloadRef"></a>
	</div>
</template>

<script>
import SelectColumn from './SelectColumn.vue'
import { mapState } from 'vuex'
export default {
	name: 'OperationMenu',
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
		}
	},
	components: {
		SelectColumn
	},
	data() {
		return {
			// 文件搜索数据
			searchFile: {
				fileName: ''
			},
			operatePopoverVisible: false, //  收纳栏是否显示
			fileGroupLable: 0, //  文件展示模式
			dirImg: require('_a/images/file/dir.png'),
			wordImg: require('_a/images/file/file_word.svg'),
			excelImg: require('_a/images/file/file_excel.svg'),
			pptImg: require('_a/images/file/file_ppt.svg')
		}
	},
	computed: {
    ...mapState({
      showUploadMask: state => state.uploadFile.showUploadMask
    }),
		// 上传文件组件参数
		uploadFileParams() {
			return {
				filePath: this.filePath,
				isDir: 0
			}
		},
		// 文件查看模式 0 列表模式 1 网格模式 2 时间线模式
		fileModel() {
			return this.$store.getters.fileModel
		},
		// 图标大小
		gridSize: {
			get() {
				return this.$store.getters.gridSize
			},
			set(val) {
				this.$store.commit('changeGridSize', val)
			}
		},
		// 被选中的文件列表
		selectedFiles() {
			return this.$store.state.fileList.selectedFiles
		},
		// 是否批量操作
		isBatchOperation() {
			return this.$store.state.fileList.isBatchOperation
		},
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		},
		// 批量下载文件链接
		batchDownloadLink() {
			return `${
				this.$config.baseContext
			}/filetransfer/batchDownloadFile?userFileIds=${this.selectedFiles
				.map((item) => item.userFileId)
				.join(',')}`
		}
	},
	watch: {
    // 显示拖拽上传文件遮罩
    showUploadMask() {
        this.handleUploadFileBtnClick(3);
    },
		fileType(newValue, oldValue) {
			if (oldValue === 1 && this.fileModel === 2) {
				this.$store.commit('changeFileModel', 0)
				this.fileGroupLable = 0
			}
		},
		/**
		 * 监听收纳栏状态
		 * @description 打开时，body 添加点击事件的监听
		 */
		operatePopoverVisible(newValue) {
			if (newValue === true) {
				document.body.addEventListener('click', this.closeOperatePopover)
			} else {
				document.body.removeEventListener('click', this.closeOperatePopover)
			}
		}
	},
	mounted() {
		this.fileGroupLable = this.fileModel
	},
	methods: {
		/**
		 * 新建文件夹按钮点击事件
		 * @description 调用新建文件夹服务，并在弹窗确认回调事件中刷新文件列表
		 */
		handleClickAddFolderBtn() {
			this.$openDialog
				.addFolder({
					filePath: this.$route.query.filePath || '/'
				})
				.then((res) => {
					if (res === 'confirm') {
						this.$emit('getTableDataByType')
					}
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
					if (res === 'confirm') {
						this.$emit('getTableDataByType')
					}
				})
		},
		/**
		 * 上传文件按钮点击事件
		 * @description 通过Bus通信，开启全局上传文件流程
		 * @param {boolean} uploadWay 上传方式 0-文件上传 1-文件夹上传 2-粘贴图片或拖拽上传
		 */
		handleUploadFileBtnClick(uploadWay) {
			this.$openDialog.authWeChat({}).then((res) => {
				switch (res) {
					case 'confirm': {
						this.$common.goAccount('/settings/account')
						break
					}
					case 'go': {
						this.$openBox.uploadFile({
							params: this.uploadFileParams,
							uploadWay,
							serviceEl: this,
							callType: 1 //  callType 调用此服务的方式：1 - 顶部栏，2 - 右键菜单
						})
						break
					}
				}
			})
		},

		/**
		 * 批量删除按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
		 */
		handleBatchDeleteBtnClick() {
			this.$openDialog
				.deleteFile({
					isBatchOperation: true,
					fileInfo: this.selectedFiles,
					deleteMode: this.fileType === 6 ? 2 : 1 //  删除模式：1-删除到回收站 2-彻底删除
				})
				.then((res) => {
					if (res === 'confirm') {
						this.$emit('getTableDataByType')
						this.$store.dispatch('showStorage')
					}
				})
		},
		/**
		 * 批量移动按钮点击事件
		 */
		handleBatchMoveBtnClick() {
			if (this.selectedFiles.length > 0) {
				this.$openDialog
					.moveFile({
						isBatchOperation: true,
						fileInfo: this.selectedFiles
					})
					.then((res) => {
						if (res === 'confirm') {
							this.$emit('getTableDataByType')
						}
					})
			} else {
				this.$message.warning('请先勾选文件')
			}
		},
		/**
		 * 批量分享按钮点击事件
		 */
		handleBatchShareBtnClick() {
			this.$openDialog.shareFile({
				fileInfo: this.selectedFiles.map((item) => {
					return {
						userFileId: item.userFileId
					}
				})
			})
		},
		/**
		 * 打包批量下载按钮点击事件
		 */
		handleBatchDownloadBtnClick() {
			this.$refs['batchDownloadRef'].click()
		},
		/**
		 * 搜索输入框搜索事件
		 * @param {string} value 搜索内容
		 */
		handleSearchInputChange(value) {
			if (value === '') {
				this.$emit('getTableDataByType')
			} else {
				this.$emit('getSearchFileList', value)
			}
		},
		/**
		 * 网格模式下，批量操作状态切换
		 */
		handleBatchOperationChange() {
			this.$store.commit('changeIsBatchOperation', !this.isBatchOperation)
		},
		/**
		 * 文件查看模式切换
		 * @param {number} label 0 列表 1 网格 2 时间线
		 */
		handleFileDisplayModelChange(label) {
			this.fileGroupLable = label
			// 关闭右键菜单事件
			this.$openBox.contextMenu.close()
			this.$store.commit('changeFileModel', label)
			this.handleSearchInputChange(this.searchFile.fileName)
			// 关闭收纳栏
			this.operatePopoverVisible = false
		},
		/**
		 * 格式化图标大小显示
		 * @param {number} val 改变后的数值
		 */
		formatTooltip(val) {
			return `${val}px`
		},
		/**
		 * 关闭收纳栏
		 */
		closeOperatePopover(event) {
			if (!event.target.className.includes('setting-icon')) {
				this.operatePopoverVisible = false
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.operation-menu-wrapper.file-type-6 {
  margin: 8px 0;
  justify-content: flex-end;
}

.operation-menu-wrapper {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .create-operate-group {
    .upload-drop {
      float: left;
      >>> .el-button {
        border-radius: 4px 0 0 4px;
      }
    }
    .create-drop {
      float: left;
    }
  }

  .batch-operate-group {
    flex: 1;
  }

  .select-file-input {
    margin-right: 8px;
    width: 250px;

    .el-icon-search {
      cursor: pointer;
      font-size: 16px;

      &:hover {
        color: $Primary;
      }
    }
  }

  .batch-icon,
  .model-icon {
    margin-right: 8px;
    &:last-of-type {
      margin-right: 0;
    }
  }

  .model-icon.active {
    color: $Primary;
  }

  .refresh-icon, .batch-icon, .model-icon, .setting-icon {
    font-size: 20px;
    cursor: pointer;
    color: $SecondaryText;

    &:hover {
      color: $Primary;
    }
  }

  .batch-icon.active {
    color: $Primary;
  }
}

.split-line {
  margin: 8px 0;
}

.img-text-wrapper {
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
    height: 24px;
  }
}
</style>
