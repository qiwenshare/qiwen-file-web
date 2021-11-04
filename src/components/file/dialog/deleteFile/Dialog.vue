<template>
	<!-- 删除文件对话框 -->
	<el-dialog
		title="删除文件"
		:visible.sync="visible"
		:close-on-click-modal="false"
		width="550px"
		@close="handleDialogClose"
	>
		<div v-if="deleteMode === 1">删除后可在回收站查看, 是否继续删除？</div>
		<div v-else-if="deleteMode === 2">此操作将永久删除该文件, 是否继续？</div>
		<div slot="footer" class="dialog-footer">
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
import {
	batchDeleteFile,
	batchDeleteRecoveryFile,
	deleteFile,
	deleteRecoveryFile
} from '_r/file.js'

export default {
	name: 'DeleteFileDialog',
	data() {
		return {
			visible: false, //  对话框是否可见
			sureBtnLoading: false
		}
	},
	methods: {
		/**
		 * 删除文件对话框 | 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
		handleDialogClose() {
			this.visible = false
			this.callback('cancel')
		},
		/**
		 * 删除文件对话框 | 确定按钮点击事件
		 * @description 区分 删除到回收站中 | 在回收站中彻底删除，调用相应的删除文件接口
		 */
		async handleDialogSure() {
			this.sureBtnLoading = true
			let res = null
			// 批量删除模式
			if (this.isBatchOperation) {
				// 区分删除类型
				switch (this.deleteMode) {
					// 删除文件到回收站
					case 1: {
						res = await batchDeleteFile({
							files: JSON.stringify(this.fileInfo)
						})
						break
					}
					// 回收站中彻底删除
					case 2: {
						res = await batchDeleteRecoveryFile({
							recoveryFileIds: JSON.stringify(this.fileInfo)
						})
						break
					}
				}
			} else {
				// 单文件删除模式
				// 区分删除类型
				switch (this.deleteMode) {
					// 删除文件到回收站
					case 1: {
						res = await deleteFile({
							userFileId: this.fileInfo.userFileId
						})
						break
					}
					// 回收站中彻底删除
					case 2: {
						res = await deleteRecoveryFile({
							recoveryFileId: this.fileInfo.recoveryFileId
						})
						break
					}
				}
			}
			if (res.success) {
				this.sureBtnLoading = false
				this.$message.success('删除成功')
				this.visible = false
				this.callback('confirm')
			} else {
				this.sureBtnLoading = false
				this.$message.error('删除失败，' + res.message)
			}
		}
	}
}
</script>
