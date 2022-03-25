<template>
	<!-- 新建文件对话框 -->
	<el-dialog
		title="新建文件"
		:visible.sync="visible"
		:close-on-click-modal="false"
		width="550px"
		@close="handleDialogClose"
	>
		<el-form
			class="add-file-form"
			:model="form"
			:rules="formRules"
			ref="addFileForm"
			label-width="100px"
			label-position="top"
		>
			<el-form-item label="文件名称" prop="fileName">
				<el-input
					v-model="form.fileName"
					placeholder="请输入文件名称"
					type="textarea"
					autosize
					maxlength="255"
					show-word-limit
				></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleDialogClose">取 消</el-button>
			<el-button
				type="primary"
				:loading="sureBtnLoading"
				@click="handleDialogSure('addFileForm')"
				>确 定</el-button
			>
		</div>
	</el-dialog>
</template>

<script>
import { createOfficeFile } from '_r/onlyoffice.js'

export default {
	name: 'AddFileDialog',
	data() {
		return {
			visible: false, //  对话框是否可见
			form: {
				fileName: ''
			},
			formRules: {
				fileName: [
					{ required: true, message: '请输入文件名称', trigger: 'blur' }
				]
			},
			sureBtnLoading: false
		}
	},
	methods: {
		/**
		 * 新建文件对话框 | 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
		handleDialogClose() {
			this.$refs['addFileForm'].resetFields()
			this.visible = false
			this.callback('cancel')
		},
		/**
		 * 新建文件对话框 | 确定按钮点击事件
		 * @description 校验表单，校验通过后调用新建文件接口
		 * @param {string} formName 表单ref值
		 */
		handleDialogSure(formName) {
			this.sureBtnLoading = true
			this.$refs[formName].validate((valid) => {
				if (valid) {
					createOfficeFile({
						extendName: this.extendName,
						filePath: this.filePath,
						fileName: this.form.fileName
					})
						.then((res) => {
							this.sureBtnLoading = false
							if (res.success && res.code === 0) {
								this.$message.success('文件创建成功')
								this.$refs[formName].resetFields()
								this.visible = false
								this.callback('confirm')
							} else {
								this.$message.warning(res.message)
							}
						})
						.catch(() => {
							this.sureBtnLoading = false
						})
				} else {
					this.sureBtnLoading = false
					return false
				}
			})
		}
	}
}
</script>
