<template>
	<!-- 文件平铺 -->
	<div class="file-grid-wrapper">
		<ul
			class="file-list"
			v-loading="loading"
			element-loading-text="文件加载中……"
		>
			<li
				class="file-item"
				v-for="(item, index) in fileListSorted"
				:key="index"
				:title="getFileNameComplete(item)"
				:style="`width: ${gridSize + 40}px; `"
				:class="{
					active: item.userFileId === selectedFile.userFileId,
					'drag-over': item.userFileId === targetFile.userFileId
				}"
				draggable="true"
				@click="handleFileNameClick(item, index, fileListSorted)"
				@contextmenu.prevent="handleContextMenu(item, index, $event)"
				@dragstart="handleDragStart($event, item)"
				@dragover="handleDragover($event, item)"
				@drop="handleDrop($event, item)"
			>
				<img
					class="file-img"
					:src="setFileImg(item)"
					:style="`width: ${gridSize}px; height: ${gridSize}px;`"
				/>
				<div class="file-name" v-html="getFileNameComplete(item, true)"></div>
				<div
					class="file-checked-wrapper"
					:class="{ checked: item.checked }"
					v-show="isBatchOperation"
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
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { moveFile } from '_r/file.js'

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
		loading: Boolean
	},
	data() {
		return {
			fileListSorted: [],
			officeFileType: ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'],
			selectedFile: {},
			targetFile: {}, //  移动文件时的目标文件夹
			selectedIndex: 0
		}
	},
	computed: {
		/**
		 * gridSize: 图标大小
		 *  */
		...mapGetters(['gridSize']),
		// 是否批量操作
		isBatchOperation() {
			return this.$store.state.fileList.isBatchOperation
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
		// 批量操作模式 - 监听被选中的文件
		selectedFileList(newValue) {
			this.$store.commit('changeSelectedFiles', newValue)
			this.$store.commit('changeIsBatchOperation', newValue.length !== 0)
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
			this.selectedFile = item
			if (!this.isBatchOperation) {
				event.preventDefault()
				this.$openContextMenu({
					selectedFile: item,
					domEvent: event
				}).then((res) => {
					this.selectedFile = {}
					if (res === 'confirm') {
						this.$emit('getTableDataByType') //  刷新文件列表
						this.$store.dispatch('showStorage') //  刷新存储容量
					}
				})
			}
		},
		/**
		 * 拖拽开始触发的函数
		 */
		handleDragStart(event, item) {
			console.log(event)
			console.log('开始', item.fileName)
			this.selectedFile = item
			event.title = '移动到'
		},
		/**
		 * 在何处放置被拖动的数据
		 */
		handleDragover(event, item) {
			// 文件夹允许被放置
			if (item.isDir === 1) {
				this.targetFile = item
				event.preventDefault()
			}
		},
		/**
		 * 拖拽结束
		 */
		handleDrop(event, item) {
			event.preventDefault()
			this.targetFile = item
			// 单文件移动
			let reqData = {
				oldFilePath: this.selectedFile.filePath,
				filePath: `${item.filePath}${item.fileName}/`,
				fileName: this.selectedFile.fileName,
				extendName: this.selectedFile.extendName
			}
			console.log('结束时触发', reqData)
			this.$emit('update:loading', true)
			moveFile(reqData)
				.then((res) => {
					this.$emit('update:loading', false)
					if (res.success) {
						this.$message.success('移动成功')
						this.$emit('getTableDataByType') //  刷新文件列表
						this.$store.dispatch('showStorage') //  刷新存储容量
					} else {
						this.$message.error(res.message)
					}
				})
				.catch(() => {
					this.$emit('update:loading', false)
				})
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
        >>> .keyword {
          color: $Danger;
        }
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
    .file-item.drag-over {
      background: $PrimaryHover;
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
}
</style>
