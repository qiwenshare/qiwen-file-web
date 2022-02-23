<template>
	<div id="app">
		<HeaderNav v-if="isHeaderShow" id="headWrapper"></HeaderNav>
		<router-view class="main-content"></router-view>
		<FooterNav v-if="isFooterShow"></FooterNav>
		<el-backtop class="backtop" title="回到顶部"></el-backtop>
	</div>
</template>

<script setup lang="ts">
import HeaderNav from '_c/HeaderNav.vue'
import FooterNav from '_c/FooterNav.vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { commonStore } from './store/common'
const route: any = useRoute()
const common = commonStore()

//  头部是否显示
const isHeaderShow = computed(() => {
	let routerNameList = ['Onlyoffice', 'Error_401', 'Error_404', 'Error_500']
	return routerNameList.includes(route.name) ? false : true
})
//  底部是否显示
const isFooterShow = computed(() => {
	let routerNameList = [
		'Onlyoffice',
		'File',
		'Share',
		'Error_401',
		'Error_404',
		'Error_500'
	]
	return routerNameList.includes(route.name) ? false : true
})

onMounted(() => {
	window.addEventListener('resize', function () {
		return (() => {
			common.changeScreenWidth(document.body.clientWidth)
		})()
	})
})
</script>
<style lang="scss" scoped>
@import '_a/styles/element-plus-varibles.scss';

#app {
	height: 100%;
	overflow-x: hidden;
	-webkit-text-size-adjust: none;
	overflow-y: auto;
	:deep(.el-backtop) {
		background-color: $Success;
		color: #fff;
		z-index: 3;
	}
	.main-content {
		flex: 1;
		width: 90%;
		min-height: calc(100vh - 70px);
		margin: 0 auto;
		display: flex;
	}
}
</style>
