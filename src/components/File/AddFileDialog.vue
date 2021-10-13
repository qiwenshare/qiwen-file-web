<template>
  <!-- 新建文件对话框 -->
  <el-dialog
    title="新建文件"
    :visible.sync="dialogFileStatus"
    :close-on-click-modal="false"
    width="550px"
  >
    <el-form
      class="add-File-form"
      :model="form"
      :rules="formRules"
      ref="addFileForm"
      label-width="100px"
      label-position="top"
    >
      <el-form-item label="文件名称" prop="fileName">
        <el-input
          v-model="form.fileName"
          placeholder="请输入文件名称"
          type="textarea"
          autosize
          maxlength="255"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleAddFileDialogCancel('addFileForm')">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleAddFileDialogOk('addFileForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createOfficeFile } from '_r/onlyoffice.js'

export default {
  name: 'AddFileDialog',
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
    },
    // 文件扩展名
    extendName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      form: {
        fileName: ''
      },
      formRules: {
        fileName: [{ required: true, message: '请输入文件名称', trigger: 'blur' }]
      },
      loading: false
    }
  },
  computed: {
    // 对话框是否可见
    dialogFileStatus: {
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
     * 新建文件对话框 | 取消按钮点击事件
     * @description 关闭对话框，重置表单
     * @param {string} formName 表单ref值
     */
    handleAddFileDialogCancel(formName) {
      this.dialogFileStatus = false
      this.$refs[formName].resetFields()
    },
    /**
     * 新建文件对话框 | 确定按钮点击事件
     * @description 校验表单，校验通过后调用新建文件接口
     * @param {string} formName 表单ref值
     */
    handleAddFileDialogOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createOfficeFile({
            fileName: this.form.fileName,
            filePath: this.filePath,
            extendName: this.extendName
          }).then((res) => {
            this.loading = false
            if (res.success) {
              this.$message.success('文件创建成功')
              this.dialogFileStatus = false
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