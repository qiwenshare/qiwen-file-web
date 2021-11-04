<template>
	<div class="file-table-wrapper">
		<!-- 文件表格 -->
		<el-table
			class="file-table"
			:class="['file-type-' + fileType, routeName === 'Share' ? 'share' : '']"
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
			<el-table-column
				type="selection"
				key="selection"
				width="55"
				v-if="fileType !== 8"
			></el-table-column>
			<el-table-column label prop="isDir" key="isDir" width="60" align="center">
				<template slot-scope="scope">
					<img
						:src="setFileImg(scope.row)"
						:title="`${scope.row.isDir ? '' : '点击预览'}`"
						style="width: 30px; max-height: 30px; cursor: pointer"
						@click="
							handleFileNameClick(scope.row, scope.$index, sortedFileList)
						"
					/>
				</template>
			</el-table-column>
			<el-table-column
				prop="fileName"
				key="fileName"
				:sort-by="['isDir', 'fileName']"
				sortable
				show-overflow-tooltip
			>
				<template slot="header">
					<span>文件名</span>
				</template>
				<template slot-scope="scope">
					<div
						style="cursor: pointer"
						:title="`${scope.row.isDir ? '' : '点击预览'}`"
						@click="
							handleFileNameClick(scope.row, scope.$index, sortedFileList)
						"
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
				v-if="![0, 8].includes(Number($route.query.fileType))"
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
				width="120"
				prop="fileSize"
				key="fileSize"
				:sort-by="['isDir', 'fileSize']"
				sortable
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
				v-if="
					selectedColumnList.includes('uploadTime') &&
					![7, 8].includes(fileType)
				"
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
				v-if="fileType === 8"
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
				v-if="fileType === 8"
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
				v-if="fileType === 8"
			>
				<template slot-scope="scope">
					<div>
						<i
							class="el-icon-warning"
							v-if="getFileShareStatus(scope.row.endTime)"
						></i>
						<i class="el-icon-time" v-else></i>
						{{ scope.row.endTime }}
					</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
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
			officeFileType: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
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
		 * @description 打开右键菜单
		 * @param {object} row 当前行数据
		 * @param {object} column 当前列数据
		 * @param {object} event 当前右键元素
		 */
		handleContextMenu(row, column, event) {
			event.preventDefault()
			this.$refs.multipleTable.setCurrentRow(row) //  选中当前行
			this.$openContextMenu({
				selectedFile: row,
				domEvent: event
			}).then((res) => {
				this.$refs.multipleTable.setCurrentRow() //  取消当前选中行
				if (res === 'confirm') {
					this.$emit('getTableDataByType') //  刷新文件列表
					this.$store.dispatch('showStorage') //  刷新存储容量
				}
			})
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
		 * 表格选择项发生变化时的回调函数
		 * @param {[]} selection 勾选的行数据
		 */
		handleSelectRow(selection) {
			this.$store.commit('changeSelectedFiles', selection)
			this.$store.commit('changeIsBatchOperation', selection.length !== 0)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.file-table-wrapper {
  margin-top: 2px;

  .file-type-0 {
    height: calc(100vh - 206px) !important;

    >>> .el-table__body-wrapper {
      height: calc(100vh - 262px) !important;
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

  .file-table {
    width: 100% !important;
    height: calc(100vh - 203px);

    >>> .el-table__header-wrapper {
      th {
        // background: $tabBackColor;
        padding: 4px 0;
        color: $RegularText;
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
      setScrollbar(6px, transparent, #C0C4CC);

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
