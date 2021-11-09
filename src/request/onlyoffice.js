// onlyoffice 相关接口
import { post } from './http'

// 创建文档
export const createOfficeFile = (p) => post('/office/createofficefile', p)
// 编辑文档
export const editOfficeFile = (p) => post('/office/editofficefile', p)
// 查看文档
export const previewOfficeFile = (p) => post('/office/previewofficefile', p)
