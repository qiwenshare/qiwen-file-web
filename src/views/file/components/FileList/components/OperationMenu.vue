<template>
  <div>
    <el-upload
      class="upload-demo"
      action="api/filetransfer/uploadfile/"
      :data="uploadFileData"
      multiple
      :show-file-list="false"
      :on-success="onUploadSuccess"
    >
      <el-button size="medium"  type="primary" icon="el-icon-upload2" id="uploadFileId">上传</el-button>
    </el-upload>

    <el-button size="medium"  @click="addFolder()">新建文件夹</el-button>

    <el-button-group v-if="selectionFile.length != 0">
      <el-button size="medium" icon="el-icon-delete" @click="deleteSelectedFile()">删除</el-button>
      <el-button size="medium"  icon="el-icon-edit"  @click="moveSelectedFile()">移动</el-button>
      <el-button size="medium"  icon="el-icon-document-copy">拷贝</el-button>
      
      <el-button size="medium"  icon="el-icon-download">下载</el-button>
    </el-button-group>

    <div class="storeDisWrapper" style="float:right;">
      已使用
      <span id="storageid">{{storageValue}}</span>M容量
    </div>
    <SelectFileDialog  ref="SelectFileDialog"></SelectFileDialog>
  </div>
</template>

<script>
import SelectFileDialog from "./SelectFileDialog"

export default {
  name: "OperationMenu",
  data() {
    return {
      storageValue: "",
      uploadFileData: {
        filepath: "/",
        isdir: 0
      }
    };
  },
  components:{
    SelectFileDialog
  },
  watch: {
    $route(to) {
      var filepath = to.query.filepath;
      if (filepath == null || filepath == "" || filepath == "/") {
        filepath = "/";
      }
      this.uploadFileData.filepath = filepath;
    }
  },
  props: {
    // 接收父组件的传值
    filepath: String,
    selectionFile: Array,
    operationFile: Object
  },
  created: function() {
    this.showStorage();
  },
  methods: {
    moveSelectedFile(){
      this.$refs.SelectFileDialog.showMoveFileDialog(this.selectionFile);
    },
    async deleteSelectedFile(){
      let _this = this;
      console.log(JSON.stringify(this.selectionFile))
      await this.$http
        .batchDeleteFile(
          {
            files: JSON.stringify(this.selectionFile)
          },
          true
        )
        .then(function(res) {
          let result = res.data;
          if (result.success) {
            _this.$message({
              message: result.data,
              type: "success"
            });
            _this.$emit("showFileList", _this.filepath);
          } else {
            console.log("失敗" + result);
          }
        });
    },
    onUploadSuccess(result) {
      if(result.success){
        this.$message({
          message: "上传成功",
          type: "success"
        });
      }else{
        this.$message({
          message: result.errorMessage,
          type: "warning"
        });
      }
      
      this.$emit("showFileList", this.filepath);
    },
    addFolder() {
      this.$prompt("请输入文件夹名称", "创建文件夹", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.createFile(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },

    async createFile(fileName) {
      let _this = this;
      await this.$http
        .createFile(
          {
            filename: fileName,
            filepath: this.filepath,
            isdir: 1
          },
          true
        )
        .then(function(res) {
          let result = res.data;
          if (result.success) {
            _this.$message({
              message: "添加成功",
              type: "success"
            });
            _this.$emit("showFileList", _this.filepath);
          } else {
            _this.$message({
              message: result.errorMessage,
              type: "warning"
            });
          }
        });
    },
    async showStorage() {
      var _this = this;
      await this.$http.getstorage({}, true).then(function(res) {
        let result = res.data;
        if (result.success) {
          _this.storageValue = (
            result.data.storagesize /
            (1024 * 1024)
          ).toFixed(2);
        } else {
          console.log("失敗" + result);
        }
      });
    }
  }
};
</script>

<style scoped>
.upload-demo {
  display: inline-block;
}
.el-button--medium {
    margin-left: 10px;
}
</style>