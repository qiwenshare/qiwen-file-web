<template>
  <div class="select-column-wrapper">
    <el-button type="info" size="mini" plain icon="el-icon-s-operation" @click="selectColumnBtn">设置显示列</el-button>
    <el-dialog
      title="筛选列"
      width="700px"
      :visible.sync="dialogVisible"
    >
      <el-checkbox-group v-model="checkboxSelectColumnList">
        <el-checkbox
          v-for="item in columnOptions"
          :key="item.value"
          :label="item.value"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectColumn',
  props: {

  },
  data() {
    return {
      dialogVisible: false,
      columnOptions: [{
        value: 'extendName',
        label: '类型'
      }, {
        value: 'fileSize',
        label: '大小'
      }, {
        value: 'uploadTime',
        label: '修改日期'
      }, {
        value: 'deleteTime',
        label: '删除日期'
      }],
      checkboxSelectColumnList: []
    }
  },
  computed: {
    selectedColumnList() {
      return this.$store.getters.selectedColumnList
    }
  },
  methods: {
    // 筛选列按钮
    selectColumnBtn() {
      this.checkboxSelectColumnList = [ ...this.selectedColumnList ]
      this.dialogVisible = true
    },
    // 筛选列模态框 确定按钮
    dialogOk() {
      this.$store.commit('changeSelectedColumnList', this.checkboxSelectColumnList)
      this.dialogVisible = false
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