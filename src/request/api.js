// api统一管理，接口和参数请查看
// https://docs.qq.com/sheet/DVm9lRHJEYXlhVXBl?ADUIN=2435065796&ADSESSION=1566983882&ADTAG=CLIENT.QQ.5603_.0&ADPUBNO=26933&tab=BB08J2&c=D7A0A0
const API = {
  /**
   * 示例及参数说明
   *  login: { method: 'post', url: '/user/userLogin' }
   *  login: 接口名称
   *  method: 请求方法，包括get post put petch delete等，注意请求方法有无在axios.js中封装
   *  url: 后端接口
   * */
  /**
   * 调用示例及说明
   * async testLogin() { //async+自定义的函数名称，async和awati必须成对使用，参见ES6
      await this.$http.login().then(function (res) { //await+this.$http.+接口名称
        console.log(res);
      });
   */
  //添加新的接口，接口之间用逗号隔开
  /* 用户登录 */
  addUser: { method: 'post', url: '/user/adduser' }, //登录 
  login: { method: 'post', url: '/user/userlogin' }, //登录 
  checkUserLoginInfo: { method: 'post', url: '/user/checkuserlogininfo' }, //登录状态 
  logout: { method: 'post', url: '/logout' }, //登录 
  getAttentionListByUserId: {method:'post', url:'/user/getattentionlistbyuserid'}, //获取关注用户列表
  getUserInfoById:{method:'post', url:'/user/getuserinfobyid'}, //获取用户信息
  authorize:{method:'post', url:'/user/authorize/qq'}, //qq登录接口

  /* 用户注册 */
  sendVerCode: { method: 'post', url: '/user/sendverificationcode' }, //发送验证码

  /*个人设置*/
  updateUserInfo: { method: 'post', url: '/user/updateuserinfo' }, //发送验证码


  /* 文件模块接口 */
  getfilelist: { method:'post', url: '/file/getfilelist' }, //获取文件列表
  getstorage: { method:'post', url: '/filetransfer/getstorage' }, //获取存储占用
  unzipfile: { method:'post', url: '/file/unzipfile' }, //解压文件
  deleteFile: {method:'post', url: '/file/deletefile'}, //删除文件
  selectFileByFileType: { method:'post', url: '/file/selectfilebyfiletype' }, // 通过文件类型选择文件
  downloadFile: {method:'post', url:'/filetransfer/downloadfile'},
  getFileTree: {method: 'post', url: '/file/getfiletree'}, //获取文件的树结构
  moveFile: {method: 'post', url:'/file/movefile'}, //移动文件
  createFile: {method: 'post', url: '/file/createfile'}, //创建文件
  batchDeleteFile: {method:'post', url:'/file/batchdeletefile'}, //批量删除文件
  batchMoveFile: {method:'post', url:'/file/batchmovefile'}, //批量移动文件

  

  
  
}

export default API