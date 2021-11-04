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
			// 右键菜单
			rightMenu: {
				isShow: false,
				top: 0,
				left: 0
			},
			// 右键解压缩菜单
			unzipMenu: {
				top: 0,
				bottom: 'auto',
				left: '138px',
				right: 'auto'
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
		 * gridSize: 图标大小
		 *  */
		...mapGetters(['selectedColumnList', 'fileModel', 'gridSize']),
		// 是否批量操作
		isBatchOperation() {
			return this.$store.state.fileList.isBatchOperation
		},
		// 批量操作模式 - 被选中的文件
		selectedFileList() {
			let res = this.fileListSorted.filter((item) => item.checked)
			return res
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
		// 批量操作模式 - 监听被选中的文件
		selectedFileList(newValue) {
			this.$store.commit('changeSelectedFiles', newValue)
			this.$store.commit('changeIsBatchOperation', newValue.length !== 0)
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
			if (!this.isBatchOperation) {
				event.preventDefault()
				this.$openContextMenu({
					selectedFile: item,
					domEvent: event
				}).then((res) => {
					console.log(res)
					this.$refs.multipleTable.setCurrentRow() //  取消当前选中行
					if (res === 'confirm') {
						this.$emit('getTableDataByType') //  刷新文件列表
					}
				})
			}
		},
		/**
		 * 关闭右键列表
		 */
		closeRightMenu() {
			this.rightMenu.isShow = false
			this.selectedFile = {}
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
