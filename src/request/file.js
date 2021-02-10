//  文件模块接口
import { get, post } from './http'

export const getfilelist = p => get('/file/getfilelist', p); //获取文件列表
export const getstorage = p => get('/filetransfer/getstorage', p); //获取存储占用
export const speedUploadFile = p => post('/filetransfer/speeduploadfile', p);
export const unzipfile = p => post('/file/unzipfile', p); //解压文件
export const deleteFile = p => post('/file/deletefile', p); //删除文件
export const selectFileByFileType = p => get('/file/selectfilebyfiletype', p); // 通过文件类型选择文件
export const getFileTree = p => get('/file/getfiletree', p); //获取文件的树结构
export const moveFile = p => post('/file/movefile', p); //移动文件
export const createFile = p => post('/file/createfile', p); //创建文件
export const batchDeleteFile = p => post('/file/batchdeletefile', p); //批量删除文件
export const batchMoveFile = p => post('/file/batchmovefile', p); //批量移动文件
export const renameFile = p => post('/file/renamefile', p); //重命名文件
export const getRecoveryFile = p => post('/recoveryfile/list', p); // 获取回收站文件列表
export const deleteRecoveryFile = p => post('/recoveryfile/deleterecoveryfile', p); // 回收站文件删除
export const restoreRecoveryFile = p => post('/recoveryfile/restorefile', p); // 回收站文件还原
export const batchDeleteRecoveryFile = p => post('/recoveryfile/batchdelete', p); // 回收站文件批量删除
