<template>
	<div class="register-wrapper" id="registerBackground">
		<div class="form-wrapper">
			<h1 class="register-title">注册</h1>
			<p class="register-system">{{ $config.siteName }}</p>
			<!-- 注册表单 -->
			<el-form
				class="register-form"
				ref="registerForm"
				:model="registerForm"
				:rules="registerFormRules"
				label-width="100px"
				hide-required-asterisk
			>
				<el-form-item prop="username">
					<el-input
						prefix-icon="el-icon-user"
						v-model="registerForm.username"
						placeholder="用户名"
					></el-input>
				</el-form-item>
				<el-form-item prop="telephone">
					<el-input
						prefix-icon="el-icon-mobile-phone"
						v-model="registerForm.telephone"
						placeholder="手机号"
					></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						prefix-icon="el-icon-lock"
						v-model="registerForm.password"
						placeholder="密码"
						show-password
					></el-input>
				</el-form-item>
				<!-- 页面宽度大于 768 像素时，直接在表单项内显示滑动解锁 -->
				<el-form-item style="user-select: none" v-if="screenWidth > 768">
					<drag-verify
						ref="dragVerifyRef"
						text="请按住滑块拖动解锁"
						successText="验证通过"
						handlerIcon="el-icon-d-arrow-right"
						successIcon="el-icon-circle-check"
						handlerBg="#F5F7FA"
						:width="375"
						:isPassing.sync="isPassing"
						@update:isPassing="updateIsPassing"
					></drag-verify>
				</el-form-item>
				<el-form-item class="registerButtonWrapper">
					<el-button
						class="registerButton"
						type="primary"
						:disabled="registerBtnDisabled"
						:loading="registerBtnLoading"
						@click="submitForm('registerForm')"
						>注册</el-button
					>
				</el-form-item>
			</el-form>
		</div>
		<!-- 页面宽度小于等于 768 像素时，在遮罩层内显示滑动解锁，以防止移动端浏览器自带的左滑返回上一页手势 -->
		<div
			class="drag-verify-modal"
			v-show="isShowDragVerify"
			v-if="screenWidth <= 768"
			@click.self="isShowDragVerify = false"
		>
			<drag-verify
				ref="dragVerifyRef"
				text="请按住滑块拖动解锁"
				successText="验证通过"
				handlerIcon="el-icon-d-arrow-right"
				successIcon="el-icon-circle-check"
				handlerBg="#F5F7FA"
				:width="300"
				:isPassing.sync="isPassing"
				@update:isPassing="updateIsPassing"
			></drag-verify>
		</div>
	</div>
</template>

<script>
import CanvasNest from 'canvas-nest.js'
import DragVerify from '_c/common/DragVerify.vue' //  引入滑动解锁组件
import { addUser } from '_r/user.js'

// 配置
const config = {
	color: '230, 162, 60', // 线条颜色
	pointColor: '230, 162, 60', // 节点颜色
	opacity: 0.5, // 线条透明度
	count: 99, // 线条数量
	zIndex: -1 // 画面层级
}

export default {
	name: 'Register',
	components: { DragVerify },
	data() {
		return {
			// 注册表单
			registerForm: {
				telephone: '',
				username: '',
				password: ''
			},
			// 注册表单校验规则
			registerFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{
						min: 5,
						max: 20,
						message: '长度在 5 到 20 个字符',
						trigger: 'blur'
					}
				],
				telephone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }
				]
			},
			isShowDragVerify: false, //  页面宽度小于 768px 时，滑动解锁是否显示
			isPassing: false, //  滑动解锁是否验证通过
			registerBtnDisabled: true, //  注册按钮是否禁用
			registerBtnLoading: false //  注册按钮是否 loading 状态
		}
	},
	computed: {
		// 屏幕宽度
		screenWidth() {
			return this.$store.state.common.screenWidth
		}
	},
	watch: {
		//  滑动解锁验证通过时，若重新输入手机号、用户名或密码，滑动解锁恢复原样
		'registerForm.telephone'() {
			this.resetVerifyPassing()
		},
		'registerForm.username'() {
			this.resetVerifyPassing()
		},
		'registerForm.password'() {
			this.resetVerifyPassing()
		}
	},
	created() {
		//  绘制背景图
		this.$nextTick(() => {
			let element = document.getElementById('registerBackground')
			new CanvasNest(element, config)
		})
	},
	mounted() {
		if (this.screenWidth <= 768) {
			this.registerBtnDisabled = false
		}
	},
	methods: {
		/**
		 * 重置滑动解锁至未解锁状态
		 * 注册按钮禁用
		 */
		resetVerifyPassing() {
			this.isPassing = false
			this.$refs.dragVerifyRef.reset()
			if (this.screenWidth > 768) {
				this.registerBtnDisabled = true
			}
		},
		/**
		 * 滑动解锁完成 回调函数
		 * @param {boolean} isPassing 解锁是否通过
		 */
		updateIsPassing(isPassing) {
			if (isPassing) {
				//  校验手机号
				this.$refs.registerForm.validateField('telephone', (telephoneError) => {
					if (telephoneError) {
						// 校验未通过
						if (this.screenWidth > 768) {
							this.registerBtnDisabled = true
						}
					} else {
						// 校验通过
						if (this.screenWidth <= 768) {
							this.handleUserRegister('registerForm')
						} else {
							this.registerBtnDisabled = false
						}
					}
				})
			} else {
				if (this.screenWidth > 768) {
					this.registerBtnDisabled = true
				}
			}
		},
		/**
		 * 注册按钮点击事件 表单验证&用户注册
		 * @param {boolean} formName 表单ref值
		 */
		submitForm(formName) {
			this.registerBtnLoading = true
			this.$refs[formName].validate((valid) => {
				if (valid) {
					// 表单各项校验通过
					if (this.screenWidth > 768) {
						this.handleUserRegister(formName)
					} else {
						this.isShowDragVerify = true
						this.registerBtnLoading = false
					}
				} else {
					this.$message.error('请完善信息！')
					this.registerBtnLoading = false
					return false
				}
			})
		},
		/**
		 * 用户注册
		 */
		handleUserRegister(formName) {
			addUser(this.registerForm)
				.then((res) => {
					this.registerBtnLoading = false
					if (this.screenWidth <= 768) {
						this.isShowDragVerify = false
					}
					if (res.success) {
						this.$notify({
							title: '成功',
							message: '注册成功！已跳转到登录页面',
							type: 'success'
						})
						this.$refs[formName].resetFields()
						this.$router.replace({ path: '/login' })
					} else {
						this.$message.error(res.message)
					}
				})
				.catch(() => {
					this.registerBtnLoading = false
					if (this.screenWidth <= 768) {
						this.isShowDragVerify = false
					}
				})
		}
	}
}
</script>
<style lang="stylus" scoped>
.register-wrapper {
  // height: 500px !important;
  min-height: calc(100vh - 189px) !important;
  width: 100% !important;
  padding-top: 50px;

  .form-wrapper {
    width: 375px;
    margin: 0 auto;
    text-align: center;

    .register-title {
      margin-bottom: 10px;
      font-weight: 300;
      font-size: 30px;
      color: #000;
    }

    .register-system {
      font-weight: 300;
      color: #999;
    }

    .register-form {
      width: 100%;
      margin-top: 20px;

      >>> .el-form-item__content {
        margin-left: 0 !important;
      }

      &>>> .el-input__inner {
        font-size: 16px;
      }

      .registerButtonWrapper {
        .registerButton {
          width: 100%;
        }

        &>>> .el-button {
          padding: 10px 90px;
          font-size: 16px;
        }
      }
    }

    .tip {
      width: 70%;
      margin-left: 86px;
    }
  }
}
</style>
