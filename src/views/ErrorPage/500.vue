<template>
  <div class="error-500-wrapper">
    <h2 class="title">服务器出错，请联系管理员！</h2>
    <img :src="error_500_img" />
  </div>
</template>

<script>
export default {
  name: 'Error_500',
  data() {
    return {
      error_500_img: require('@/assets/images/error/500.png')
    }
  },
  mounted() {
    this.$emit('footer', false)
    this.$emit('header', false)
  }
}
</script>

<style lang="stylus" scoped>
.error-500-wrapper
  display: initial !important
  padding: 100px 0
  text-align: center
  .title
    padding-bottom: 20px
</style>
