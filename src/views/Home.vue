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

<script>
import Banner from '_c/home/Banner.vue'
import Notice from '_c/home/Notice.vue'
import Function from '_c/home/Function.vue'

export default {
	name: 'Home',
	components: {
		Banner,
		Notice,
		Function
	}
}
</script>

<style lang="stylus" scoped>
.home-wrapper {
  width: 100% !important;
  flex-direction column
}
</style>
