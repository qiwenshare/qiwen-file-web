<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in breadCrumbList" :key="index">
        <a @click="clickbread(item.breadPath)">{{item.breadName}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  
</template>

<script>
export default {
  name: "BreadCrumb",
  data(){
    return {
      breadCrumbList:[]
    }
  },
  props:{ // 接收父组件的传值
    filepath: String
  },
  watch: {
    $route(to, from) {
      //debugger;
      let filetype = from.query.filetype;
      let filepath = to.query.filepath;
      if(filetype != null){
        //this.$router.push({path:to.fullPath, query: {filetype:filetype, filepath:filepath}});
      }
      this.showBreadCrumb();
    }
  },
  created: function(){
    this.showBreadCrumb();
  },
  methods:{
    clickbread: function(breadPath){
      let filetype = this.$route.query.filetype;
      console.log(filetype);
      
      if (filetype == null || filetype == ""){
        this.$router.push({
          path: "/file",
          query: { filepath: breadPath}
        });
      }else{
        this.$router.push({
          path: "/file",
          query: { filepath: breadPath, filetype: filetype }
        });
      }
    },
    showBreadCrumb: function() {
      let filepath = this.$route.query.filepath;
      var nameArr;
      if (filepath == null || filepath == undefined){
        nameArr = [];
      }else{
        nameArr = filepath.split("/");
      }
      var tempPath = "/";
      var breadCrumbList = [];
      var breadCrumbObj = {};
      breadCrumbObj.breadName = "全部文件";
      breadCrumbObj.breadPath = "/";
      breadCrumbList.push(breadCrumbObj);
      for (var i = 0; i < nameArr.length; i++) {
        if (nameArr[i] == "") {
          continue;
        }
        tempPath += nameArr[i];
        tempPath += "/";
        var breadCrumbObj = {};
        breadCrumbObj.breadName = nameArr[i];
        breadCrumbObj.breadPath = tempPath;
        breadCrumbList.push(breadCrumbObj);
      }
      
      this.breadCrumbList = breadCrumbList;
    }
  }
  
}
</script>

<style scoped>

</style>