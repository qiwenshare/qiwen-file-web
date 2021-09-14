<template>
  <!-- 新建文件夹对话框 -->
  <el-dialog
    title="新建文件夹"
    :visible.sync="dialogStatus"
    :close-on-click-modal="false"
    width="550px"
  >
    <el-form
      class="add-folder-form"
      :model="form"
      :rules="formRules"
      ref="addFolderForm"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="文件夹名称" prop="fileName">
        <el-input
          v-model="form.fileName"
          placeholder="请输入文件夹名称"
          type="textarea"
          autosize
          maxlength="255"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleAddFolderDialogCancel('addFolderForm')">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleAddFolderDialogOk('addFolderForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createFold } from '@/request/file.js'

export default {
  name: 'AddFolderDialog',
  props: {
    // 对话框是否可见
    visible: {
      type: Boolean,
      required: true
    },
    // 文件路径
    filePath: {
      required: true,
      type: String
    }
  },
  data() {
    const validateFileName = (rule, value, callback) => {
      const fileNameReg = new RegExp(`[\\\\/:*?\"<>|]`);
      if (value && fileNameReg.test(value)) {
        callback(new Error(`文件夹名称不能包含下列任何字符：\\\/:*?"<>|`));
      } else {
        callback();
      }
    };
    return {
      form: {
        fileName: ''
      },
      formRules: {
        fileName: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { validator: validateFileName, trigger: ['blur', 'change'] }
        ]
      },
      loading: false
    }
  },
  computed: {
    // 对话框是否可见
    dialogStatus: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    /**
     * 新建文件夹对话框 | 取消按钮点击事件
     * @description 关闭对话框，重置表单
     * @param {string} formName 表单ref值
     */
    handleAddFolderDialogCancel(formName) {
      this.dialogStatus = false
      this.$refs[formName].resetFields()
    },
    /**
     * 新建文件夹对话框 | 确定按钮点击事件
     * @description 校验表单，校验通过后调用新建文件夹接口
     * @param {string} formName 表单ref值
     */
    handleAddFolderDialogOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createFold({
            fileName: this.form.fileName,
            filePath: this.filePath,
            isDir: 1
          }).then((res) => {
            this.loading = false
            if (res.success) {
              this.$message.success('添加成功')
              this.dialogStatus = false
              this.$refs[formName].resetFields()
              this.$emit('confirmDialog')
            } else {
              this.$message.warning(res.message)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>