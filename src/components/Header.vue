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
			<!-- 为了和其他菜单样式保持一致，请一定要添加类名 el-menu-item -->
			<div class="el-menu-item exit" @click="exitButton()" v-show="isLogin">
				退出
			</div>
			<div class="el-menu-item username" v-show="isLogin">
				<i class="el-icon-user-solid"></i>{{ username }}
			</div>
			<el-menu-item
				class="login"
				index="Login"
				:route="{ name: 'Login' }"
				v-show="!isLogin"
				>登录</el-menu-item
			>
			<!-- 生产环境 -->
			<el-menu-item class="register" v-if="isProductEnv" v-show="!isLogin">
				<a href="https://www.qiwenshare.com/register" target="_blank">注册</a>
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

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Header',
	data() {
		return {
			logoUrl: require('_a/images/common/logo_header.png'),
			logoUrlXs: require('_a/images/common/logo_header_xs.png')
		}
	},
	computed: {
		...mapGetters(['isLogin', 'username']),
		// 当前激活菜单的 index
		activeIndex() {
			return this.$route.name || 'Home' //  获取当前路由名称
		},
		isProductEnv() {
			return (
				process.env.NODE_ENV !== 'development' &&
				location.origin === 'https://pan.qiwenshare.com'
			)
		}
	},
	methods: {
		/**
		 * 退出登录
		 * @description 清除 cookie 存放的 token  并跳转到登录页面
		 */
		exitButton() {
			this.$message.success('退出登录成功！')
			this.$store.dispatch('getUserInfo').then(() => {
				this.removeCookies(this.$config.tokenKeyName)
				this.$router.push({ path: '/login' })
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

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

  >>> .el-menu--horizontal {
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

    .login, .register, .username, .exit {
      float: right;
    }
  }
}
</style>
