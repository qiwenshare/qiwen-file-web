<template>
  <!--选择目录弹出窗dialog-->
    <el-dialog title="选择目录" :visible.sync="dialogMoveFileVisible">
      <div class="el-dialog-div">
        <el-tree
          :data="fileTree"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="selectNodeClick"
        ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMoveFileVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchMoveFile">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  name : "SelectFileDialog",
  data(){
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      dialogMoveFileVisible: false,
      selectionFile: [],
      fileTree: [],
      selectFilePath: "", //移动文件路径
    }
  },
  methods:{
    async confirmMoveFile() {
      this.dialogMoveFileVisible = false;
      
      let _this = this;
      await this.$http
        .moveFile(
          {
            oldfilepath: this.operationFile.filepath,
            newfilepath: this.selectFilePath,
            filename: this.operationFile.filename,
            extendname: this.operationFile.extendname
          },
          true
        )
        .then(function(res) {
          let result = res.data;
          if (result.success) {
            _this.showFileList(_this.filepath);
            _this.$message({
              message: "移动文件成功",
              type: "success"
            });
          } else {
            alert(result.errorMessage);
          }
        });
    },
    async batchMoveFile(){
      this.dialogMoveFileVisible = false;

      let _this = this;
      console.log(JSON.stringify(this.selectionFile))
      await this.$http
        .batchMoveFile(
          {
            newfilepath : this.selectFilePath,
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
    selectNodeClick: function(data) {

      if (data.attributes.filepath == null) {
        this.selectFilePath = "/";
      } else {
        this.selectFilePath = data.attributes.filepath;
      }
    },
    showMoveFileDialog(file) {
      
      this.selectionFile = file;
      this.dialogMoveFileVisible = true;
      this.initFileTree();
    },
    async initFileTree() {
      let _this = this;
      await this.$http.getFileTree({}, true).then(function(res) {
        let result = res.data;
        if (result.success) {
          _this.fileTree = [result.data];
        } else {
          alert(result.errorMessage);
        }
      });
    }
  }
  
}
</script>

<style scoped>

</style>