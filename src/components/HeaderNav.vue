<template>
	<div class="header-wrapper">
		<img class="logo" :src="logoUrl" @click="$router.push({ name: 'Home' })" />
		<img
			class="logo-xs"
			:src="logoUrlXs"
			@click="$router.push({ name: 'Home' })"
		/>
		<el-menu
			:default-active="activeIndex"
			class="top-menu-list"
			mode="horizontal"
			router
		>
			<el-menu-item index="Home" :route="{ name: 'Home' }">首页</el-menu-item>
			<el-menu-item
				index="File"
				:route="{ name: 'File', query: { fileType: 0, filePath: '/' } }"
				>网盘</el-menu-item
			>
			<li class="el-menu-item external-link">
				<a href="https://pan.qiwenshare.com/docs/" target="_blank">文档</a>
			</li>
			<template v-if="isLogin">
				<el-sub-menu
					class="user-exit-submenu"
					index="User"
					v-if="screenWidth <= 768"
				>
					<template slot="title">
						<i class="el-icon-user-solid"></i>
						<span>{{ username }}</span>
					</template>
					<el-menu-item @click="exitButton()">退出</el-menu-item>
				</el-sub-menu>
				<template v-else>
					<!-- 为了和其他菜单样式保持一致，请一定要添加类名 el-menu-item -->
					<div class="el-menu-item exit" @click="exitButton()">退出</div>
					<div class="el-menu-item username" v-show="isLogin">
						<i class="el-icon-user-solid"></i> <span>{{ username }}</span>
					</div>
				</template>
			</template>
			<!-- 生产环境 -->
			<el-menu-item class="register" v-if="isProductEnv" v-show="!isLogin">
				<a :href="getAccountHref('/login/account')" target="_self">登录</a>
			</el-menu-item>
			<!-- 开发环境 -->
			<el-menu-item
				class="login"
				index="Login"
				:route="{ name: 'Login' }"
				v-else
				v-show="!isLogin"
				>登录</el-menu-item
			>
			<!-- 生产环境 -->
			<el-menu-item class="register" v-if="isProductEnv" v-show="!isLogin">
				<a :href="getAccountHref('/register')" target="_blank">注册</a>
			</el-menu-item>
			<!-- 开发环境 -->
			<el-menu-item
				class="register"
				v-else
				v-show="!isLogin"
				index="Register"
				:route="{ name: 'Register' }"
				>注册</el-menu-item
			>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import logoUrl from '/images/common/logo_header.png'
import logoUrlXs from '/images/common/logo_header_xs.png'
import globalConfig from '@/config/index'
import globalFunction from '@/libs/globalFunction'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store/user'
import { commonStore } from '@/store/common'

const route = useRoute()
const router = useRouter()
const user = userStore()
const common = commonStore()

// 当前激活菜单的 index
const activeIndex = computed(() => {
	return route.name || 'Home' //  获取当前路由名称
})
// 是否为生产环境
const isProductEnv = computed(() => {
	return (
		process.env.NODE_ENV !== 'development' &&
		location.origin === 'https://pan.qiwenshare.com'
	)
})
// 屏幕宽度
const screenWidth = computed(() => {
	return common.screenWidth
})
// 是否登录
const isLogin = user.isLogin
// 用户名
const username = user.username
// 奇文社区生产环境账户网址
const getAccountHref = (path: string) => {
	return `https://account.qiwenshare.com${path}?Rurl=${location.href}`
}
/**
 * 退出登录
 * @description 清除 cookie 存放的 token  并跳转到登录页面
 */
const exitButton = () => {
	ElMessage.success('退出登录成功！')
	globalFunction.removeCookies(globalConfig.tokenKeyName)
	user.getUserInfo().then(() => {
		router.push({ name: 'Home' })
	})
}
</script>

<style lang="scss" scoped>
@import '_a/styles/element-plus-varibles.scss';

.header-wrapper {
	width: 100%;
	padding: 0 20px;
	box-shadow: $tabBoxShadow;
	display: flex;
	.logo {
		margin: 14px 24px 0 24px;
		display: inline-block;
		height: 40px;
		cursor: pointer;
	}
	.logo-xs {
		display: none;
	}
	:deep(.el-menu--horizontal) {
		.el-menu-item:not(.is-disabled):hover {
			border-bottom-color: $Primary !important;
			background: $tabBackColor;
		}
		.external-link {
			padding: 0;
			a {
				display: block;
				padding: 0 20px;
			}
		}
	}
	.top-menu-list {
		flex: 1;
		display: block;
		.login,
		.register,
		.username,
		.exit,
		.user-exit-submenu {
			float: right;
		}
	}
}
</style>
