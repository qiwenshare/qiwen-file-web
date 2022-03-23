<template>
	<div class="login-page">
		<el-card class="login-card">
			<template #header>
				<div class="card-header">登录</div>
			</template>
			<el-form
				class="login-form"
				ref="loginFormRef"
				:model="loginForm"
				label-width="0"
			>
				<el-form-item prop="telephone">
					<el-input
						:prefix-icon="Iphone"
						v-model="loginForm.telephone"
						placeholder="手机号"
					></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input
						:prefix-icon="Lock"
						v-model="loginForm.password"
						placeholder="密码"
						show-password
					></el-input>
				</el-form-item>
				<el-form-item class="login-btn-form-item">
					<el-button
						class="login-btn"
						type="primary"
						:loading="loginBtnLoading"
						@click="handleClickLoginBtn(loginFormRef)"
						>登录</el-button
					>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Iphone, Lock } from '@element-plus/icons-vue'
import { login } from '_r/user'
import { useRouter } from 'vue-router'
import { userStore } from '@/store/user'
import globalConfig from '@/config/index'
import globalFunction from '@/libs/globalFunction'
import type { ElForm } from 'element-plus'

const router = useRouter()
const user = userStore()
const loginForm = reactive({
	telephone: '',
	password: ''
})
type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginBtnLoading = ref(false)
const handleClickLoginBtn = (formEl: FormInstance | undefined) => {
	if (!formEl) return false
	loginBtnLoading.value = true
	formEl.validate((valid) => {
		if (valid) {
			console.log(loginForm)
			login(loginForm)
				.then((res) => {
					loginBtnLoading.value = false
					if (res.success) {
						globalFunction.setCookies(globalConfig.tokenKeyName, res.data.token) //  存储登录状态
						user.userInfoObj = res.data
						user.isLogin = true
						router.push({ name: 'File' })
						formEl.resetFields()
					}
				})
				.catch(() => {
					loginBtnLoading.value = false
				})
		} else {
			return false
		}
	})
}
</script>

<style lang="scss" scoped>
.login-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.login-card {
		margin: 0 auto;
		width: 400px;
		.card-header {
			text-align: center;
		}
		.login-form {
			.login-btn-form-item {
				.el-button {
					width: 100%;
				}
			}
		}
	}
}
</style>
