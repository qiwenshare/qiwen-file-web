// 文件模块相关接口
import { get, post } from './http'

/**
 * 获取文件列表相关接口
 */
// 获取文件列表（区分文件路径）
export const getFileListByPath = (p?: any) => get('/file/getfilelist', p)
// 获取文件列表（区分文件类型）
export const getFileListByType = (p?: any) =>
	get('/file/selectfilebyfiletype', p)
// 获取回收站文件列表
export const getRecoveryFile = (p?: any) => post('/recoveryfile/list', p)
// 获取我已分享的文件列表
export const getMyShareFileList = (p?: any) => get('/share/shareList', p)
// 获取存储占用
export const getStorage = (p?: any) => get('/filetransfer/getstorage', p)
// 获取文件目录树
export const getFoldTree = (p?: any) => get('/file/getfiletree', p)

/**
 * 单文件操作相关接口
 */
// 创建文件
export const createFold = (p?: any) => post('/file/createfile', p)
// 删除文件
export const deleteFile = (p?: any) => post('/file/deletefile', p)
// 复制文件
export const copyFile = (p?: any) => post('/file/copyfile', p)
// 移动文件
export const moveFile = (p?: any) => post('/file/movefile', p)
// 重命名文件
export const renameFile = (p?: any) => post('/file/renamefile', p)
// 解压文件
export const unzipFile = (p?: any) => post('/file/unzipfile', p)
// 全局搜索文件
export const searchFile = (p?: any) => get('/file/search', p)
// 分享文件
export const shareFile = (p?: any) => post('/share/sharefile', p)
// 校验分享链接过期时间
export const checkShareLinkEndtime = (p?: any) => get('/share/checkendtime', p)
// 校验分享链接是否需要提取码
export const checkShareLinkType = (p?: any) => get('/share/sharetype', p)
// 校验分享链接提取码是否正确
export const checkShareLinkCode = (p?: any) =>
	get('/share/checkextractioncode', p)
// 获取分享文件列表
export const getShareFileList = (p?: any) => get('/share/sharefileList', p)
// 保存分享文件
export const saveShareFile = (p?: any) => post('/share/savesharefile', p)

/**
 * 文件批量操作相关接口
 */
// 批量删除文件
export const batchDeleteFile = (p?: any) => post('/file/batchdeletefile', p)
// 批量移动文件
export const batchMoveFile = (p?: any) => post('/file/batchmovefile', p)

/**
 * 回收站文件操作相关接口
 */
// 回收站文件删除
export const deleteRecoveryFile = (p?: any) =>
	post('/recoveryfile/deleterecoveryfile', p)
// 回收站文件还原
export const restoreRecoveryFile = (p?: any) =>
	post('/recoveryfile/restorefile', p)
// 回收站文件批量删除
export const batchDeleteRecoveryFile = (p?: any) =>
	post('/recoveryfile/batchdelete', p)

/**
 * 文件公共接口
 */
// 文件预览
export const getFilePreview = (p?: any) => get('/filetransfer/preview', p)
// 文件修改
export const modifyFileContent = (p?: any) => post('/file/update', p)
