<template>
  <div class="move-dialog-wrapper">
    <!-- 移动文件-选择目标路径 -->
    <el-dialog title="选择目标路径" :visible.sync="dialogData.visible" @open="handleDialogOpen">
      <div class="el-dialog-div">
        <el-tree
          :data="fileTree"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('setDialogData', null, false)">取 消</el-button>
        <el-button type="primary" @click="$emit('confirmDialog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFoldTree } from '@/request/file.js'

export default {
  name: 'MoveFileDialog',
  props: {
    dialogData: Object
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      fileTree: []
    }
  },
  methods: {
    /**
     * 对话框打开的回调
     */
    handleDialogOpen() {
      this.initFileTree()
    },
    /**
     * 初始化文件目录树
     */
    initFileTree() {
      getFoldTree().then((res) => {
        if (res.success) {
          this.fileTree = [res.data]
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 目录树节点点击回调函数
     * @description 将当前节点中的文件夹路径传递给父组件
     * @param {object} data 当前点击的节点信息
     */
    handleNodeClick(data) {
      let selectFilePath = data.attributes.filePath ? data.attributes.filePath : '/'
      this.$emit('setSelectFilePath', selectFilePath)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/mixins.styl';

.move-dialog-wrapper {
  >>> .el-dialog {
    .el-dialog__header {
      display: flex;
    }

    .el-dialog__body {
      padding: 10px 30px;

      .el-dialog-div {
        height: 300px;
        overflow: auto;
        setScrollbar(6px);

        .el-tree {
          .el-tree-node__content {
            height: 34px;
            font-size: 16px;

            .el-icon-caret-right {
              font-size: 18px;
            }
          }

          .el-tree-node.is-current>.el-tree-node__content {
            color: $Primary;

            .el-tree-node__expand-icon {
              color: inherit;
            }
          }
        }
      }
    }
  }
}
</style>
