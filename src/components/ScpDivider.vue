<template>
  <div class="divider">
    <div class="first"></div>
    <i class="el-icon-bicycle"></i>
    <div class="second"></div>
  </div>
</template>

<script>
export default {
  name: 'ScpDivider'
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.divider
  width: 100%
  height: 2px
  margin: 20px 0
  display: flex
  .first
    flex: 2
    background: $Primary
  .second
    flex: 1
    background: $Warning
  .el-icon-bicycle
    margin: -16px -10px
    color: $Success
    font-size: 20px
</style>