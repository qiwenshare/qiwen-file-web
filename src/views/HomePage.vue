<template>
	<div class="home-wrapper">
		<!-- Banner图 -->
		<Banner></Banner>
		<!-- 公告 -->
		<Notice></Notice>
		<!-- 功能介绍 -->
		<Function></Function>
	</div>
</template>

<script setup lang="ts">
import Banner from '_c/home/Banner.vue'
import Notice from '_c/home/Notice.vue'
import Function from '_c/home/Function.vue'
</script>

<style lang="scss" scoped>
.home-wrapper {
	width: 100% !important;
	flex-direction: column;
}
</style>
