<template>
  <div class="error-401-wrapper">
    <h2 class="title">您没有访问权限！</h2>
    <img :src="error_401_img" />
  </div>
</template>

<script>
export default {
  name: 'Error_401',
  data() {
    return {
      error_401_img: require('@/assets/images/error/401.png')
    }
  },
  mounted() {
    this.$emit('footer', false)
    this.$emit('header', false)
  }
}
</script>

<style lang="stylus" scoped>
.error-401-wrapper
  display: initial !important
  padding: 100px 0
  text-align: center
  .title
    padding-bottom: 20px
</style>
