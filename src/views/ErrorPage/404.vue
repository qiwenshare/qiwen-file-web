<template>
	<div class="error-404-wrapper">
		<h2 class="title">您的页面飞走了……</h2>
		<img :src="error_404_img" />
	</div>
</template>

<script>
export default {
	name: 'Error_404',
	data() {
		return {
			error_404_img: require('_a/images/error/404.png')
		}
	}
}
</script>

<style lang="stylus" scoped>
.error-404-wrapper {
  display: initial !important;
  padding: 100px 0;
  text-align: center;

  .title {
    padding-bottom: 20px;
  }
}
</style>
