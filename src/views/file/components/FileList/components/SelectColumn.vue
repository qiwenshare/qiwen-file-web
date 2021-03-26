<template>
  <div class="select-column">
    <el-button type="info" size="mini" plain icon="el-icon-s-operation" @click="handleClickSelectColumn"
      >设置显示列</el-button
    >
    <!-- 对话框 当点击"设置显示列"按钮时弹出对话框 -->
    <el-dialog title="设置表格列显隐" width="700px" :visible.sync="dialogVisible">
      <!-- 多选框组件 勾选需要在表格中显示的列 -->
      <el-checkbox-group v-model="selectedColumn">
        <el-checkbox v-for="item in columnOptions" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
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
  data() {
    return {
      dialogVisible: false,
      selectedColumn: [], //  被选中的表格需要显示的列
      columnOptions: [
        {
          value: 'extendName',
          label: '类型'
        },
        {
          value: 'fileSize',
          label: '大小'
        },
        {
          value: 'uploadTime',
          label: '修改日期'
        },
        {
          value: 'deleteTime',
          label: '删除日期'
        }
      ]
    }
  },
  methods: {
    // 设置显示列按钮 - 点击事件
    handleClickSelectColumn() {
      // 获取store中存储的表格显示列
      this.selectedColumn = this.$store.getters.selectedColumnList
      this.dialogVisible = true
    },
    // 对话框 确定按钮
    dialogOk() {
      // 通过提交 mutation 更新表格显示列
      this.$store.commit('changeSelectedColumnList', this.selectedColumn)
      this.dialogVisible = false
    }
  }
}
</script>
