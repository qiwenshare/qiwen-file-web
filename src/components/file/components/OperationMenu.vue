<template>
	<div class="operation-menu-wrapper" :class="'file-type-' + fileType">
		<el-button-group class="create-operate-group">
			<el-dropdown class="upload-drop" trigger="hover">
				<el-button
					size="mini"
					type="primary"
					icon="el-icon-upload2"
					id="uploadFileId"
					:disabled="(selectionFile.length && batchOperate) || fileType !== 0"
					>上传<i class="el-icon-arrow-down el-icon--right"></i
				></el-button>
				<el-dropdown-menu
					slot="dropdown"
					:disabled="(selectionFile.length && batchOperate) || fileType !== 0"
				>
					<el-dropdown-item @click.native="handleUploadFileBtnClick(0)"
						>上传文件</el-dropdown-item
					>
					<el-dropdown-item @click.native="handleUploadFileBtnClick(1)"
						>上传文件夹</el-dropdown-item
					>
					<el-dropdown-item
						@click.native="handleUploadFileBtnClick(2)"
						title="截图粘贴或拖拽上传"
						>拖拽上传</el-dropdown-item
					>
				</el-dropdown-menu>
			</el-dropdown>
			<el-button
				size="mini"
				type="primary"
				icon="el-icon-plus"
				@click="dialogAddFolder.visible = true"
				:disabled="(selectionFile.length && batchOperate) || fileType !== 0"
				>新建文件夹</el-button
			>
			<el-dropdown class="create-drop" trigger="hover">
				<el-button
					size="mini"
					type="primary"
					icon="el-icon-edit-outline"
					id="uploadFileId"
					:disabled="(selectionFile.length && batchOperate) || fileType !== 0"
					>新建在线文档<i class="el-icon-arrow-down el-icon--right"></i
				></el-button>
				<el-dropdown-menu
					slot="dropdown"
					:disabled="(selectionFile.length && batchOperate) || fileType !== 0"
				>
					<el-dropdown-item @click.native="handleCreateFile('docx')">
						<img
							:src="wordImg"
							style="width: 24px; max-height: 24px; cursor: pointer"
						/>Word 文档</el-dropdown-item
					>
					<el-dropdown-item @click.native="handleCreateFile('xlsx')">
						<img
							:src="excelImg"
							style="width: 24px; max-height: 24px; cursor: pointer"
						/>Excel 工作表</el-dropdown-item
					>
					<el-dropdown-item @click.native="handleCreateFile('pptx')"
						><img
							:src="pptImg"
							style="width: 24px; max-height: 24px; cursor: pointer"
						/>PPT 演示文稿</el-dropdown-item
					>
				</el-dropdown-menu>
			</el-dropdown>
		</el-button-group>
		<el-button-group class="batch-operate-group">
			<el-button
				size="mini"
				type="primary"
				v-if="selectionFile.length && batchOperate"
				icon="el-icon-delete"
				@click="handleBatchDeleteBtnClick()"
				>批量删除</el-button
			>
			<el-button
				size="mini"
				type="primary"
				v-if="
					selectionFile.length && !fileType && fileType !== 6 && batchOperate
				"
				icon="el-icon-rank"
				@click="handleBatchMoveBtnClick()"
				>批量移动</el-button
			>
			<el-button
				size="mini"
				type="primary"
				v-if="selectionFile.length && fileType !== 6 && batchOperate"
				icon="el-icon-download"
				@click="handleBatchDownloadBtnClick()"
				>批量下载</el-button
			>
			<el-button
				size="mini"
				type="primary"
				v-if="
					selectionFile.length &&
					fileType !== 6 &&
					$route.name !== 'Share' &&
					batchOperate
				"
				icon="el-icon-share"
				@click="handleBatchShareBtnClick()"
				>批量分享</el-button
			>
		</el-button-group>

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
			:class="batchOperate ? 'active' : ''"
			:title="batchOperate ? '取消批量操作' : '批量操作'"
			v-if="fileModel === 1"
			@click="handleBatchOperationChange()"
		></i>
		<el-divider direction="vertical" v-if="fileModel === 1"></el-divider>

		<!-- 操作栏收纳 -->
		<el-popover placement="bottom" trigger="hover">
			<i slot="reference" class="setting-icon el-icon-setting"></i>
			<!-- 选择表格列 -->
			<SelectColumn></SelectColumn>
			<el-divider class="split-line"></el-divider>
			<!-- 文件展示模式 -->
			<div class="change-file-model">
				<div class="title">查看模式</div>
				<el-radio-group
					v-model="fileGroupLable"
					size="mini"
					@change="handleFileDisplayModelChange"
				>
					<el-radio-button :label="0">
						<i class="el-icon-tickets"></i> 列表
					</el-radio-button>
					<el-radio-button :label="1">
						<i class="el-icon-s-grid"></i> 网格
					</el-radio-button>
					<el-radio-button :label="2" v-if="fileType === 1">
						<i class="el-icon-date"></i> 时间线
					</el-radio-button>
				</el-radio-group>
			</div>
			<!-- 图标大小调整 -->
			<div
				class="change-grid-size"
				v-if="fileGroupLable === 1 || fileGroupLable === 2"
			>
				<div class="title">调整图标大小</div>
				<el-slider
					v-model="gridSize"
					:min="40"
					:max="150"
					:step="10"
					:format-tooltip="formatTooltip"
				></el-slider>
			</div>
		</el-popover>

		<!-- 新建文件夹对话框 -->
		<AddFolderDialog
			:visible.sync="dialogAddFolder.visible"
			:filePath="filePath"
			@confirmDialog="$emit('getTableDataByType')"
		></AddFolderDialog>

		<!-- 新建文件对话框 -->
		<AddFileDialog
			:visible.sync="dialogAddFile.visible"
			:filePath="filePath"
			:extendName="extendName"
			@confirmDialog="$emit('getTableDataByType')"
		></AddFileDialog>

		<!-- 多选文件下载，页面隐藏 -->
		<a
			target="_blank"
			v-for="(item, index) in selectionFile"
			:key="index"
			:href="getDownloadFilePath(item)"
			:download="item.fileName + '.' + item.extendName"
			:title="'downloadLink' + index"
			:ref="'downloadLink' + index"
		></a>
	</div>
</template>

<script>
import { batchDeleteFile, batchDeleteRecoveryFile } from '_r/file.js'
import AddFolderDialog from '_c/file/dialog/AddFolderDialog.vue'
import AddFileDialog from '_c/file/dialog/AddFileDialog.vue'
import SelectColumn from './SelectColumn.vue'

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
		},
		selectionFile: Array,
		operationFile: Object,
		batchOperate: Boolean
	},
	components: {
		AddFolderDialog,
		AddFileDialog,
		SelectColumn
	},
	data() {
		return {
			// 文件搜索数据
			searchFile: {
				fileName: ''
			},
			// 新建文件夹对话框数据
			dialogAddFolder: {
				visible: false
			},
			// 新建文件夹对话框数据
			dialogAddFile: {
				visible: false
			},
			extendName: '',
			batchDeleteFileDialog: false,
			fileGroupLable: 0, //  文件展示模式
			wordImg: require('_a/images/file/file_word.png'),
			excelImg: require('_a/images/file/file_excel.png'),
			pptImg: require('_a/images/file/file_ppt.png')
		}
	},
	computed: {
		//  上传文件组件参数
		uploadFileData: {
			get() {
				let res = {
					filePath: this.filePath,
					isDir: 0
				}
				return res
			},
			set() {
				return {
					filePath: '/',
					isDir: 0
				}
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
		}
	},
	watch: {
		fileType(newValue, oldValue) {
			if (oldValue === 1 && this.fileModel === 2) {
				this.$store.commit('changeFileModel', 0)
				this.fileGroupLable = 0
			}
		}
	},
	mounted() {
		this.fileGroupLable = this.fileModel
		this.$EventBus.$on('refreshList', () => {
			this.$emit('getTableDataByType')
		})
		this.$EventBus.$on('refreshStorage', () => {
			this.$store.dispatch('showStorage')
		})
	},
	methods: {
		/**
		 * 新建文档
		 */
		handleCreateFile(extendName) {
			this.extendName = extendName
			this.dialogAddFile.visible = true
		},
		/**
		 * 上传文件按钮点击事件
		 * @description 通过Bus通信，开启全局上传文件流程
		 * @param {boolean} type 上传方式 true 直接上传  false 拖拽上传
		 */
		handleUploadFileBtnClick(type) {
			this.$EventBus.$emit('openUploader', this.uploadFileData, type)
		},

		/**
		 * 批量删除按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
		 */
		handleBatchDeleteBtnClick() {
			if (this.fileType === 6) {
				//  回收站里 - 彻底删除
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				})
					.then(() => {
						this.confirmBatchDeleteFile(true)
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
						this.confirmBatchDeleteFile(false)
					})
					.catch(() => {})
			}
		},
		/**
		 * 批量删除文件对话框 | 确定按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
		 * @param {boolean} type 文件类型，true 在回收站中彻底删除 false 删除到回收站
		 */
		confirmBatchDeleteFile(type) {
			if (type) {
				//  回收站中删除
				batchDeleteRecoveryFile({
					recoveryFileIds: JSON.stringify(this.selectionFile)
				}).then((res) => {
					if (res.success) {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						this.$emit('getTableDataByType')
						this.$store.dispatch('showStorage')
					} else {
						this.$message.error('失败' + res.message)
					}
				})
			} else {
				//  非回收站删除
				batchDeleteFile({
					files: JSON.stringify(this.selectionFile)
				}).then((res) => {
					if (res.success) {
						this.$message({
							message: '删除成功',
							type: 'success'
						})
						this.$emit('getTableDataByType')
						this.$store.dispatch('showStorage')
					} else {
						this.$message.error('失败' + res.message)
					}
				})
			}
		},
		/**
		 * 批量移动按钮点击事件
		 */
		handleBatchMoveBtnClick() {
			/**
			 * 第一个参数 是否批量移动
			 * 第二个参数 打开/关闭移动文件对话框
			 */
			this.$emit('setMoveFileDialogData', true, true)
		},
		/**
		 * 分享按钮点击事件
		 */
		handleBatchShareBtnClick() {
			this.$emit('setShareFileDialogData')
		},
		/**
		 * 批量下载按钮点击事件
		 */
		handleBatchDownloadBtnClick() {
			for (let i = 0; i < this.selectionFile.length; i++) {
				let name = 'downloadLink' + i
				this.$refs[name][0].click()
			}
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
			this.$emit('update:batchOperate', !this.batchOperate)
		},
		/**
		 * 文件查看模式切换
		 * @param {number} label 0 列表 1 网格 2 时间线
		 */
		handleFileDisplayModelChange(label) {
			this.$store.commit('changeFileModel', label)
		},
		/**
		 * 格式化图标大小显示
		 * @param {number} val 改变后的数值
		 */
		formatTooltip(val) {
			return `${val}px`
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

  .batch-opera-btn {
    margin-right: 8px;
  }

  .batch-icon, .setting-icon {
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

.change-file-model, .change-grid-size {
  .title {
    margin: 8px 0;
    color: $SecondaryText;
    font-size: 14px;
  }
}
</style>
