<template>
  <div class="move-dialog-wrapper">
    <!-- 移动文件-选择目标路径 -->
    <el-dialog title="选择目标路径" :visible.sync="dialogData.visible" @open="handleDialogOpen">
      <div class="el-dialog-div">
        <!-- 选择的目标路径 -->
        <div class="target-path">
          <span class="label">目标路径：</span>
          <el-input class="content" v-model="targetPath" readonly size="small"></el-input>
        </div>
        <!-- 文件目录树 -->
        <el-tree
          :data="fileTree"
          :props="defaultProps"
          :highlight-current="true"
          :expand-on-click-node="false"
          node-key="attributes.filePath"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="label">{{ node.label }}</span>
            <el-button class="add-folder-btn" type="text" size="mini" @click.stop="handleAddFolderBtnClick(data)">
              新建文件夹
            </el-button>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('setDialogData', null, false)">取 消</el-button>
        <el-button type="primary" @click="$emit('confirmDialog')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新建文件夹对话框 -->
    <AddFolderDialog
      :visible.sync="dialogAddFolder.visible"
      :filePath="dialogAddFolder.filePath"
      @confirmDialog="initFileTree(dialogAddFolder.filePath)"
    ></AddFolderDialog>
  </div>
</template>

<script>
import AddFolderDialog from '@/components/File/AddFolderDialog.vue'
import { getFoldTree } from '@/request/file.js'

export default {
  name: 'MoveFileDialog',
  props: {
    dialogData: Object
  },
  components: {
    AddFolderDialog
  },
  data() {
    return {
      targetPath: '/', //  目标路径
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      fileTree: [], //  文件夹目录树
      // 新建文件夹对话框数据
      dialogAddFolder: {
        visible: false,
        filePath: '/' //  新增文件夹的父级路径
      }
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
      this.targetPath = data.attributes.filePath ? data.attributes.filePath : '/'
      this.$emit('setSelectFilePath', this.targetPath)
    },
    /**
     * 新建文件夹按钮点击事件
     */
    handleAddFolderBtnClick(data) {
      this.dialogAddFolder.filePath = data.attributes.filePath ? data.attributes.filePath : '/'
      this.dialogAddFolder.visible = true
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
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

        .target-path {
          display: flex;
          align-items: center;

          .label {
            width: 80px;
          }

          .content {
            flex: 1;
          }
        }

        .el-tree {
          .el-tree-node__content {
            height: 34px;
            font-size: 16px;

            .el-icon-caret-right {
              font-size: 18px;
            }

            .custom-tree-node {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 14px;
              padding-right: 8px;
            }

            .add-folder-btn {
              display: none;
            }

            &:hover {
              .add-folder-btn {
                display: block;
              }
            }
          }

          .el-tree-node.is-current>.el-tree-node__content {
            color: $Primary;
          }
        }
      }
    }
  }
}
</style>
