<template>
	<!-- 解压缩文件 -->
	<el-dialog
		title="解压缩文件"
		:visible.sync="visible"
		:close-on-click-modal="false"
		:show-close="false"
		@open="handleDialogOpen"
		@close="handleDialogClose"
	>
		<div class="unzip-tree-wrapper" v-if="unzipMode === 2">
			<!-- 选择的目标路径 -->
			<div class="target-path">
				<span class="label">目标路径：</span>
				<el-input
					class="content"
					v-model="targetPath"
					readonly
					size="small"
				></el-input>
			</div>
			<!-- 文件目录树 -->
			<el-tree
				:data="fileTree"
				:props="{
					children: 'children',
					label: 'label'
				}"
				:highlight-current="true"
				:expand-on-click-node="false"
				:default-expanded-keys="defaultExpandedKeys"
				node-key="id"
				v-loading="loading"
				@node-click="handleNodeClick"
			>
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span class="label">{{ node.label }}</span>
					<el-button
						class="add-folder-btn"
						type="text"
						size="mini"
						@click.stop="handleAddFolderBtnClick(data)"
					>
						新建文件夹
					</el-button>
				</span>
			</el-tree>
		</div>
		<div class="unzip-text" v-else>
			<i class="el-icon-loading"></i> 正在解压缩，请稍等片刻...
		</div>
		<div slot="footer" class="dialog-footer" v-if="unzipMode === 2">
			<el-button @click="handleDialogClose">取 消</el-button>
			<el-button
				type="primary"
				:loading="sureBtnLoading"
				@click="handleDialogSure"
				>确 定</el-button
			>
		</div>
	</el-dialog>
</template>

<script>
import { getFoldTree, unzipFile } from '_r/file.js'

export default {
	name: 'UnzipFileDialog',
	data() {
		return {
			visible: false, //  对话框是否可见
			targetPath: '/', //  目标路径
			fileTree: [], //  文件夹目录树
			loading: false, //  文件夹目录树 loading 状态
			defaultExpandedKeys: [],
			sureBtnLoading: false //  确定按钮 loading 状态
		}
	},
	methods: {
		/**
		 * 取消按钮点击事件 & 对话框关闭的回调
		 */
		handleDialogClose() {
			this.visible = false
			this.callback('cancel')
		},
		/**
		 * 对话框打开的回调
		 */
		handleDialogOpen() {
			if (this.unzipMode === 2) {
				this.initFileTree()
			} else {
				this.handleUnzipFile()
			}
		},
		/**
		 * 初始化文件目录树
		 */
		initFileTree(id) {
			this.loading = true
			getFoldTree().then((res) => {
				this.loading = false
				if (res.success) {
					this.fileTree = [res.data]
					this.defaultExpandedKeys = id ? [id] : [this.fileTree[0].id]
				} else {
					this.$message.error(res.message)
				}
			})
		},
		/**
		 * 目录树节点点击回调函数
		 * @description 将当前节点中的文件夹路径传递给父组件
		 * @param {object} data 当前点击的节点信息
		 */
		handleNodeClick(data) {
			this.targetPath = data.filePath ? data.filePath : '/'
		},
		/**
		 * 新建文件夹按钮点击事件
		 * @description 调用新建文件夹服务，并在弹窗确认回调事件中刷新文件夹树
		 */
		handleAddFolderBtnClick(data) {
			this.$openDialog
				.addFolder({
					filePath: data.filePath || '/'
				})
				.then(() => {
					this.initFileTree(data.id)
				})
		},
		/**
		 * 确定按钮点击事件
		 * @description 调用移动文件接口
		 */
		handleDialogSure() {
			this.sureBtnLoading = true
			this.handleUnzipFile()
		},
		/**
		 * 解压文件
		 */
		handleUnzipFile() {
			// unzipMode 解压模式 0-解压到当前文件夹， 1-自动创建该文件名目录，并解压到目录里， 2-手动选择解压目录
			let reqData = {
				unzipMode: this.unzipMode,
				userFileId: this.userFileId
			}
			if (this.unzipMode === 2) {
				reqData = {
					...reqData,
					filePath: this.targetPath //  解压的目标路径
				}
			}
			unzipFile(reqData).then((res) => {
				this.sureBtnLoading = false
				if (res.success) {
					this.$message.success('解压成功')
					this.visible = false
					this.callback('confirm')
				} else {
					this.$message.error(res.message)
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

>>> .el-dialog {
  .el-dialog__header {
    display: flex;
  }

  .el-dialog__body {
    padding: 10px 30px;

    .unzip-tree-wrapper {
      height: 300px;
      overflow: auto;
      setScrollbar(6px);

      .target-path {
        display: flex;
        align-items: center;

        .label {
          width: 80px;
        }

        .content {
          flex: 1;
        }
      }

      .el-tree {
        .el-tree-node__content {
          height: 34px;
          font-size: 16px;

          .el-icon-caret-right {
            font-size: 18px;
          }

          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
          }

          .add-folder-btn {
            display: none;
          }

          &:hover {
            .add-folder-btn {
              display: block;
            }
          }
        }

        .el-tree-node.is-current>.el-tree-node__content {
          color: $Primary;
        }
      }
    }
    .unzip-text {
      padding: 40px 0 64px 0;
      text-align: center;
    }
  }
}
</style>
