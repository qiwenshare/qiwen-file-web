<template>
	<!-- 微信认证提示对话框 -->
	<el-dialog
		title="微信认证提示"
		:visible.sync="visible"
		:close-on-click-modal="false"
		width="580px"
		@close="handleDialogClose"
	>
		<p class="tip">
			为保障服务器数据安全，从2022年7月27日开始，用户通过微信认证之后才能上传文件，<a
				href="https://pan.qiwenshare.com/notice/10"
				target="_blank"
				>详情查看公告</a
			><br />是否跳转到账户设置页面进行微信认证？
		</p>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleDialogClose">取 消</el-button>
			<el-button type="primary" @click="handleDialogSure()">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { getWeChatAuthState } from '_r/user.js'

export default {
	name: 'AddFolderDialog',
	data() {
		return {
			visible: false //  对话框是否可见
		}
	},
	watch: {
		/**
		 * 监听对话框打开、关闭状态
		 */
		visible(newValue) {
			if (newValue) {
				// 打开时绑定回车事件
				document.addEventListener('keyup', this.handleAddKeyupEnter)
			} else {
				// 关闭时移除回车事件
				document.removeEventListener('keyup', this.handleAddKeyupEnter)
			}
		}
	},
	methods: {
		/**
		 * 获取微信认证状态
		 */
		getWeChatAuthStateData() {
			if (
				process.env.NODE_ENV !== 'development' &&
				location.origin === 'https://pan.qiwenshare.com'
			) {
				getWeChatAuthState().then((res) => {
					if (res.success) {
						if (res.data) {
							this.callback('go')
						} else {
							this.visible = true
						}
					} else {
						this.$message.error(res.message)
					}
				})
			} else {
				this.callback('go')
			}
		},
		/**
		 * DOM 绑定回车事件
		 * @description 回车触发新增文件夹事件
		 * @param {event} event 事件
		 */
		handleAddKeyupEnter(event) {
			if (event.key === 'Enter') {
				this.handleDialogSure()
			}
		},
		/**
		 * 取消按钮点击事件 & 对话框关闭的回调
		 * @description 关闭对话框，重置表单
		 */
		handleDialogClose() {
			this.visible = false
			this.callback('cancel')
		},
		/**
		 * 确定按钮点击事件
		 * @description 校验表单，校验通过后调用新建文件夹接口
		 */
		handleDialogSure() {
			this.callback('confirm')
			this.visible = false
		}
	}
}
</script>
