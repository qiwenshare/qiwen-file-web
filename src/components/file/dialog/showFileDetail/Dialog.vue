<template>
	<!-- 查看文件详情对话框 -->
	<el-dialog
		class="file-info-dialog"
		title="文件详情"
		:visible.sync="visible"
		:close-on-click-modal="false"
		width="550px"
		@close="handleDialogClose"
	>
		<img
			class="file-img"
			:src="$file.setFileImg(fileInfo)"
			:title="`${fileInfo.isDir ? '' : '点击预览'}`"
		/>
		<el-form
			class="file-info-form"
			:model="fileInfo"
			ref="fileInfoForm"
			label-width="82px"
			label-position="right"
			label-suffix="："
			size="small"
		>
			<el-form-item label="文件名" prop="fileName">
				<el-input
					:value="$file.getFileNameComplete(fileInfo)"
					readonly
				></el-input>
			</el-form-item>
			<el-form-item
				:label="fileType === 6 ? '原路径' : '路径'"
				prop="filePath"
				v-if="![0, 8].includes(fileType)"
			>
				<el-input
					:value="fileInfo.filePath"
					readonly
					@click.native="handleClickFilePath(fileInfo)"
				></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="fileName">
				<el-input :value="$file.getFileType(fileInfo)" readonly></el-input>
			</el-form-item>
			<el-form-item label="大小" prop="fileSize">
				<el-input
					:value="
						fileInfo.isDir === 0
							? $file.calculateFileSize(fileInfo.fileSize)
							: ''
					"
					readonly
				></el-input>
			</el-form-item>
			<el-form-item
				label="修改日期"
				prop="uploadTime"
				v-if="![7, 8].includes(fileType) && !['Share'].includes(this.routeName)"
			>
				<el-input :value="fileInfo.uploadTime" readonly></el-input>
			</el-form-item>
			<el-form-item label="删除日期" prop="deleteTime" v-if="fileType === 6">
				<el-input :value="fileInfo.deleteTime" readonly></el-input>
			</el-form-item>
			<el-form-item label="分享类型" prop="shareType" v-if="fileType === 8">
				<el-input
					:value="fileInfo.shareType === 1 ? '私密' : '公共'"
					readonly
				></el-input>
			</el-form-item>
			<el-form-item label="分享时间" prop="shareTime" v-if="fileType === 8">
				<el-input :value="fileInfo.shareTime" readonly></el-input>
			</el-form-item>
			<el-form-item
				label="过期时间"
				prop="endTime"
				v-if="fileType === 8"
				class="form-item-end-time"
			>
				<el-input :value="fileInfo.endTime" readonly></el-input>
				<i
					class="status-icon el-icon-warning"
					v-if="$file.getFileShareStatus(fileInfo.endTime)"
				></i>
				<i class="status-icon el-icon-time" v-else></i>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleDialogClose">关 闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
import router from '@/router/router.js'

export default {
	name: 'FileDetailInfoDialog',
	data() {
		return {
			visible: false //  对话框是否可见
		}
	},
	computed: {
		// 左侧菜单选中的文件类型
		fileType() {
			return router.currentRoute.query.fileType
				? Number(router.currentRoute.query.fileType)
				: 0
		},
		// 路由名称
		routeName() {
			return router.currentRoute.name
		}
	},
	methods: {
		/**
		 * 查看文件详情对话框 | 对话框关闭的回调
		 * @description 关闭对话框
		 */
		handleDialogClose() {
			this.visible = false
			this.$refs.fileInfoForm.resetFields()
			this.callback('cancel')
		},
		/**
		 * 路径点击事件
		 * @param {object} fileInfo 文件信息
		 */
		handleClickFilePath(fileInfo) {
			router.push({
				query: { filePath: fileInfo.filePath, fileType: 0 }
			})
			this.handleDialogClose()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.file-img {
  display: block;
  margin: 0 auto 8px auto;
  max-width: 120px;
  width: 40%;
  height: auto;
}
>>>.el-form.file-info-form {
  .el-form-item {
    margin-bottom: 16px;
    .el-input__inner {
      border: none;
      font-size: 14px;
    }
    &.form-item-end-time {
      .el-form-item__content {
        display: flex;
        align-items: center;
        .el-input {
          width: 141px;
          .el-input__inner {
            padding-right: 0;
          }
        }
        .status-icon {
          font-size: 14px;
        }
        .el-icon-warning {
          color: $Warning;
        }
        .el-icon-time {
          color: $Success;
        }
      }
    }
  }
}
</style>
