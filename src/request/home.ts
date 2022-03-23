// 文件模块相关接口
import { get } from './http'

/**
 * 获取首页相关接口
 */
// 获取公告列表 - 带分页查询
export const getNoticeList = (p?: any) => get('/notice/list', p)
// 获取公告详情
export const getNoticeDetail = (p?: any) => get('/notice/detail', p)

/**
 * 底部信息栏
 */
// 查询系统参数组
export const getParamsDetail = (p?: any) => get('/param/grouplist', p)
