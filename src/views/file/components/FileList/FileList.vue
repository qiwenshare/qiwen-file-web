<template>
  <div>
    <el-header class="el-header">
      <OperationMenu :operationFile="operationFile" :selectionFile="selectionFile" @showFileList="showFileList" :filepath="filepath"></OperationMenu>
      <BreadCrumb class="breadCrumb" :filepath="filepath"></BreadCrumb>
    </el-header>
    <el-table @select-all="selectAllFileRow" @select="selectFileRow" ref="multipleTable" :data="fileList" tooltip-effect="dark" height="400">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="文件名" width="500">
        <template slot-scope="scope">
          <a style="cursor:pointer" @click="clickFileName(scope.$index, scope.row)">
            <img v-bind:src="scope.row.imageurl" style="max-width: 30px;" />
            {{scope.row.filename}}<span
              v-if="scope.row.isdir==0 && scope.row.extendname != null"
            >.</span>{{scope.row.extendname}}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="大小" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ scope.row.filesize==0?'-':
            (scope.row.filesize/1024 < 1024 ? (scope.row.filesize/1024).toFixed(0) + 'KB':
            (scope.row.filesize/1024/1024 < 1024 ? (scope.row.filesize/1024/1024).toFixed(1) + 'MB' :
            (scope.row.filesize/1024/1024/1024 < 1024 ? (scope.row.filesize/1024/1024/1024).toFixed(2) + 'GB' :
            (scope.row.filesize/1024/1024/1024).toFixed(3) + 'TB'))) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uploadtime" label="修改日期" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <el-button size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <!--  @click.native="moveFile(scope.row)" -->
              <el-dropdown-item @click.native="showMoveFileDialog(scope.row)">移动到</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.extendname=='zip'"
                @click.native="unzipFile(scope.row)"
              >解压缩</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.isdir==0" @click.native="downloadFile(scope.row)">下载</el-dropdown-item>
              <el-dropdown-item @click.native="deleteFile(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
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
        <el-button type="primary" @click="confirmMoveFile">确 定</el-button>
      </div>
    </el-dialog>
    <!--下载文件表单 -->
    <form ref="downloadFileForm" action="/api/filetransfer/downloadfile" method="post">
      <input type="hidden" ref="filename" name="filename" value="">
      <input type="hidden" ref="fileurl"  name="fileurl"  value="">
      <input type="hidden" ref="extendname"  name="extendname"  value="">
    </form>
  </div>
</template>

<script>
import OperationMenu from "./components/OperationMenu";
import BreadCrumb from "./components/BreadCrumb";

export default {
  name: "FileList",
  data() {
    return {
      fileList: [],
      dialogMoveFileVisible: false,
      fileTree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectFilePath: "", //移动文件路径
      operationFile: {}, //当前操作行
      selectionFile: [], //选择的文件
      filepath:"",
      filetype:""
    };
  },
  components: {
    BreadCrumb,
    OperationMenu
  },
  created: function() {
    let filepath = this.$route.query.filepath;
      
    if (filepath == null){
      filepath = "/"
    }
    this.filepath = filepath;
    this.showFileList(filepath);
  },
  watch: {
    $route(to, from) {
      let filepath = to.query.filepath;
      
      this.filetype = to.query.filetype;
      if(filepath == null){
        filepath = "/"
      }
      this.filepath = filepath;
      this.showFileList(filepath);
    }
  },
  methods: {
    selectAllFileRow(selection){
      this.selectionFile = selection;
    },
    selectFileRow(selection, row){
      this.selectionFile = selection;
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
    },
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
            _this.$message({
              message: result.errorMessage,
              type: "warning"
            });
          }
        });
    },
    unzipFile: async function(fileInfo) {
      const loading = this.$loading({
        lock: true,
        text: "正在解压缩，请稍等片刻...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let _this = this;
      await this.$http.unzipfile(fileInfo, true).then(function(res) {
        let result = res.data;
        if (result.success) {
          _this.showFileList(_this.filepath);
          _this.$message({
            message: "解压成功",
            type: "success"
          });
          loading.close();
        } else {
          _this.$message({
            message: result.errorMessage,
            type: "warning"
          });
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
      this.operationFile = file;
      this.dialogMoveFileVisible = true;
      this.initFileTree();
    },
    clickFileName(index, row) {
      this.$router.push(row.url);
    },
    getImagePathByExtend(extendname) {
      if (extendname == "png" || extendname == "jpg" || extendname == "jpeg") {
        extendname = "pic";
      } else if (extendname == "docx" || extendname == "doc") {
        extendname = "word";
      } else if (extendname == "ppt" || extendname == "pptx") {
        extendname = "ppt";
      } else if (extendname == "xls" || extendname == "xlsx") {
        extendname = "excel";
      } else if (extendname == "mp4") {
        extendname = "video";
      } else if (
        extendname == "css" ||
        extendname == "csv" ||
        extendname == "chm" ||
        extendname == "zip"
      ) {
        extendname = extendname;
      } else {
        extendname = "unknown";
      }

      return require("@/assets/images/file/file_" + extendname + ".png");
    },
    async confirmDeleteFile(fileInfo) {
      let _this = this;
      await this.$http.deleteFile(fileInfo, true).then(function(res) {
        let result = res.data;
        if (result.success) {
          _this.showFileList(_this.filepath);
          _this.$message({
            type: "success",
            message: "移动成功"
          });
        } else {
          _this.$message({
            type: "warning",
            message: result.errorMessage
          });
        }
      });
    },
    deleteFile(fileInfo) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.confirmDeleteFile(fileInfo);
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    downloadFile(file) {
      this.$refs.filename.value = file.filename;
      this.$refs.fileurl.value = file.fileurl;
      this.$refs.extendname.value = file.extendname;
      this.$refs.downloadFileForm.submit();
    },
    async showFileList(filepath) {
      
      let _this = this;
      await this.$http
        .getfilelist(
          {
            filepath: filepath
          },
          true
        )
        .then(function(res) {
          let result = res.data;
          if (result.success) {
            var data = result.data;

            var dirArr = [];
            var fileArr = [];
            for (var i = 0; i < data.length; i++) {
              var isdir = data[i].isdir;
              var filename = data[i].filename;
              var extendname = data[i].extendname;
              var url = "/file?filepath=" + filepath + filename + "/";
              if (_this.filetype != null){
               
                url = url + "&filetype=" + _this.filetype;
              }
              var fileurl = data[i].fileurl;
              var imageurl = require("@/assets/images/file/dir.png");

              if (isdir == 0) {
                url = "api" + fileurl;
                imageurl = _this.getImagePathByExtend(extendname);
              }
              var dataMap = data[i];
              dataMap.isdir = isdir;
              dataMap.isshow = false;

              dataMap.imageurl = imageurl;
              dataMap.extendname = extendname;
              dataMap.url = url;

              if (isdir == 1) {
                dirArr.push(dataMap);
              } else {
                fileArr.push(dataMap);
              }
            }
            _this.fileList = dirArr.concat(fileArr);
          } else {
            console.log("失敗" + result);
          }
        });
    }
  }
};
</script>

<style scoped>
.el-dialog-div {
  height: 200px;
  overflow: auto;
}

.el-header {
  padding-top: 10px;
  height: 90px !important;
}
.breadCrumb {
  padding-top: 10px;
}
</style>