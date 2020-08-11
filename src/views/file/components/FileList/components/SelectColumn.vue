<template>
  <div class="select-column-wrapper">
    <div class="label">展示列：</div>
    <el-select
      class="select-column"
      multiple
      size="mini"
      placeholder="请设置展示列"
      v-model="selectedColumnList"
      @change="changeColumn"  
    >
      <el-option
        v-for="item in columnOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectColumn',
  props: {

  },
  data() {
    return {
      columnOptions: [{
        value: 'extendName',
        label: '类型'
      }, {
        value: 'fileSize',
        label: '大小'
      }, {
        value: 'uploadTime',
        label: '修改日期'
      }]
    }
  },
  computed: {
    selectedColumnList: {
      get() {
        return this.$store.getters.selectedColumnList
      },
      set() {
        return []
      }
    }
  },
  methods: {
    //  选择器值改变时触发
    changeColumn(tagValueList) {
      this.$store.commit('changeSelectedColumnList', tagValueList)
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-column-wrapper
  display flex
  .label 
    height 30px
    line-height 30px
  .select-column
    width 230px 
</style>