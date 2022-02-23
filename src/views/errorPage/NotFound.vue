<template>
	<div class="not-found-wrapper">
		<h2 class="title">您的页面飞走了……</h2>
		<img :src="error_404_img" />
	</div>
</template>

<script setup lang="ts">
import error_404_img from '/images/error/404.png'
</script>

<style lang="scss" scoped>
.not-found-wrapper {
	display: initial !important;
	padding: 100px 0;
	text-align: center;
	.title {
		padding-bottom: 20px;
	}
}
</style>
