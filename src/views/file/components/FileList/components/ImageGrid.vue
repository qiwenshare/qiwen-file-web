<template>
  <div class="image-grid-wrapper">
    <ul class="image-grid">
      <li
        class="image-item"
        v-for="(item, index) in fileList"
        :key="index"
        @click="$emit('getImgReviewData', item.fileurl, true)"
      >
        <img class="image" :src="'api' + item.fileurl" :alt="item.filename + item.extendname" />
        <div class="image-name">{{item.filename + '.' + item.extendname}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ImageGrid',
  props: {
    fileList: Array
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixins.styl'
.image-grid-wrapper
  margin-top 20px
  padding 0 20px
  height calc(100vh - 200px)
  overflow-y auto
  setScrollbar(10px)
  .image-grid
    display flex
    flex-wrap wrap
    .image-item
      margin 0 10px 10px 0
      width 150px
      cursor pointer
      .image
        width 150px
        height 150px
      .image-name
        padding-top 4px
        text-align center
</style>