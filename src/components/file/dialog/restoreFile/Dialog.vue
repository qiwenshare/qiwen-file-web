<template>
	<!-- 还原文件对话框 -->
	<el-dialog
		title="还原文件"
		:visible.sync="visible"
		:close-on-click-modal="false"
		width="550px"
		@open="handleDialogOpen"
		@close="handleDialogClose"
	>
		<div class="restore-text">
			<i class="el-icon-loading"></i> 正在还原文件，请稍等片刻...
		</div>
	</el-dialog>
</template>

<script>
import { restoreRecoveryFile } from '_r/file.js'

export default {
	name: 'DeleteFileDialog',
	data() {
		return {
			visible: false //  对话框是否可见
		}
	},
	methods: {
		/**
		 * 还原文件对话框 | 对话框打开的回调
		 * @description 调用还原文件接口
		 */
		handleDialogOpen() {
			restoreRecoveryFile({
				deleteBatchNum: this.deleteBatchNum,
				filePath: this.filePath
			}).then((res) => {
				if (res.success) {
					this.$message.success('文件已还原')
					this.visible = false
					this.callback('confirm')
				} else {
					this.$message.error(res.message)
				}
			})
		},
		/**
		 * 还原文件对话框 | 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
		handleDialogClose() {
			this.visible = false
			this.callback('cancel')
		}
	}
}
</script>

<style lang="stylus" scoped>
.restore-text {
  padding: 40px 0 64px 0;
    text-align: center;
}
</style>
