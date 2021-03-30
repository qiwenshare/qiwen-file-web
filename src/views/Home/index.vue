<template>
  <div class="home-swapper">
    <!-- Banner图 -->
    <Banner></Banner>
    <!-- 功能介绍 -->
    <Function></Function>
  </div>
</template>

<script>
import Banner from './components/Banner.vue'
import Function from './components/Function.vue'

export default {
  name: 'Home',
  components: {
    Banner,
    Function
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.home-swapper {
  width: 100% !important;
  flex-direction column
}
</style>
