<template>
  <div>
    <!-- 分享对话框 -->
    <el-dialog
      title="分享文件"
      :visible.sync="dialogShareFile.visible"
      :close-on-click-modal="false"
      width="550px"
      @close="handleShareFileDialogCancel('shareFileForm')"
    >
      <el-form
        v-show="!dialogShareFile.success"
        class="share-file-form"
        :model="form"
        ref="shareFileForm"
        label-suffix="："
        label-width="130px"
        :rules="rules"
      >
        <el-form-item label="链接有效期至" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否需要提取码" prop="shareType">
          <el-radio-group v-model="form.shareType">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form
        v-if="dialogShareFile.success"
        class="share-success-form"
        :model="dialogShareFile.shareData"
        ref="shareSuccessForm"
        label-suffix="："
        label-width="90px"
      >
        <div class="success-tip">
          <i class="el-icon-success"></i>
          <span class="text">成功创建分享链接</span>
        </div>
        <el-form-item label="分享链接" prop="shareBatchNum">
          <el-input
            :value="getShareLink(dialogShareFile.shareData.shareBatchNum)"
            :readonly="true"
            type="textarea"
            autosize
          ></el-input>
        </el-form-item>
        <el-form-item label="提取码" prop="extractionCode" v-if="dialogShareFile.shareData.extractionCode">
          <el-input v-model="dialogShareFile.shareData.extractionCode" :readonly="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogShareFile.success"
          type="primary"
          @click="copyShareLink(dialogShareFile.shareData.shareBatchNum, dialogShareFile.shareData.extractionCode)"
          >复制链接及提取码</el-button
        >
        <template v-else>
          <el-button @click="handleShareFileDialogCancel('shareFileForm')">取 消</el-button>
          <el-button type="primary" :loading="dialogShareFile.loading" @click="handleShareFileDialogOk('shareFileForm')"
            >确 定</el-button
          >
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShareFileDialog',
  props: {
    dialogShareFile: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      // 分享文件对话框数据
      form: {
        // endTime: (new Date()).getTime() + 3600 * 1000 * 24,
        endTime: '',
        shareType: 0
      },
      rules: {
        endTime: [{ required: true, message: '请选择链接有效期', trigger: 'blur' }]
      },
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '1天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '7天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          },
          {
            text: '30天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 分享文件对话框 | 取消按钮点击事件
     * @description 关闭对话框，重置表单
     * @param {string} formName 表单ref值
     */
    handleShareFileDialogCancel(formName) {
      this.$emit('setDialogShareFileData', false)
      this.$refs[formName].resetFields()
    },
    /**
     * 分享文件对话框 | 确定按钮点击事件
     * @description 校验表单，校验通过后调用分享文件接口
     * @param {string} formName 表单ref值
     */
    handleShareFileDialogOk(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('setDialogShareFileData', true, this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';

.success-tip {
  margin-bottom: 16px;
  text-align: center;
  color: $Success;

  .el-icon-success {
    margin-right: 8px;
    height: 20px;
    line-height: 20px;
  }
}
</style>
