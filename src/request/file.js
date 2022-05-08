// 文件模块相关接口
import { get, post } from './http'
/**
 * 以登录接口为例
 * export const login = p => get('/user/login', p);
 *
 * login ---------- 接口名称
 * p -------------- 传参，若需要在url中拼接其他信息，传参可以改为(p, other)
 * get ------------ 接口调用的方法，来自 http.js 中封装好的四个axios方法 get/post/put/axiosDelete
 * '/user/login' -- 接口url，若需要在url中拼接其他信息：
 *                  首先需要在传参处改为(p, other1, other2)
 *                  然后将url改为`/user/${other1}/login/${other2}`
 * p -------------- 传递给 get/post/put/axiosDelete 中的查询参数/请求体
 *
 *
 *
 * 除此之外，POST 请求支持请求体格式为 FormData，那么就需要多传递一个参数，true，如下示例：
 * export const example = p => post('/test/example', p, true);
 */

/**
 * 获取文件列表相关接口
 */
// 获取文件列表（区分文件路径）
export const getFileListByPath = (p) => get('/file/getfilelist', p)
// 获取文件列表（区分文件类型）
export const getFileListByType = (p) => get('/file/selectfilebyfiletype', p)
// 获取回收站文件列表
export const getRecoveryFile = (p) => post('/recoveryfile/list', p)
// 获取我已分享的文件列表
export const getMyShareFileList = (p) => get('/share/shareList', p)
// 获取存储占用
export const getStorage = (p) => get('/filetransfer/getstorage', p)
// 获取文件目录树
export const getFoldTree = (p) => get('/file/getfiletree', p)

/**
 * 单文件操作相关接口
 */
// 创建文件
export const createFold = (p) => post('/file/createfile', p)
// 获取文件详细信息
export const getFileDetail = (p) => get('/file/detail', p)
// 删除文件
export const deleteFile = (p) => post('/file/deletefile', p)
// 复制文件
export const copyFile = (p) => post('/file/copyfile', p)
// 移动文件
export const moveFile = (p) => post('/file/movefile', p)
// 重命名文件
export const renameFile = (p) => post('/file/renamefile', p)
// 解压文件
export const unzipFile = (p) => post('/file/unzipfile', p)
// 全局搜索文件
export const searchFile = (p) => get('/file/search', p)
// 分享文件
export const shareFile = (p) => post('/share/sharefile', p)
// 校验分享链接过期时间
export const checkShareLinkEndtime = (p) => get('/share/checkendtime', p)
// 校验分享链接是否需要提取码
export const checkShareLinkType = (p) => get('/share/sharetype', p)
// 校验分享链接提取码是否正确
export const checkShareLinkCode = (p) => get('/share/checkextractioncode', p)
// 获取分享文件列表
export const getShareFileList = (p) => get('/share/sharefileList', p)
// 保存分享文件
export const saveShareFile = (p) => post('/share/savesharefile', p)

/**
 * 文件批量操作相关接口
 */
// 批量删除文件
export const batchDeleteFile = (p) => post('/file/batchdeletefile', p)
// 批量移动文件
export const batchMoveFile = (p) => post('/file/batchmovefile', p)

/**
 * 回收站文件操作相关接口
 */
// 回收站文件删除
export const deleteRecoveryFile = (p) =>
	post('/recoveryfile/deleterecoveryfile', p)
// 回收站文件还原
export const restoreRecoveryFile = (p) => post('/recoveryfile/restorefile', p)
// 回收站文件批量删除
export const batchDeleteRecoveryFile = (p) =>
	post('/recoveryfile/batchdelete', p)

/**
 * 文件公共接口
 */
// 文件预览
export const getFilePreview = (p) => get('/filetransfer/preview', p)
// 文件修改
export const modifyFileContent = (p) => post('/file/update', p)
