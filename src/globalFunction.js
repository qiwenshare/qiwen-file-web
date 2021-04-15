import Cookies from 'js-cookie'
import config from '@/config'
import { Message } from 'element-ui';

// 全局函数
const globalFunction = {
  /**
   * 获取图片缩略图路径
   * @param {object} row 文件信息
   * @returns {string} 图片缩略图路径
   */
  getImgMinPath: function (row) {
    let fileUrl = ''
    if (row.fileUrl) {
      if (row.isOSS == 1) {
        // 阿里云OSS对象存储
        fileUrl = `https://${Cookies.get('viewDomain')}${row.fileUrl}?x-oss-process=image/resize,m_fill,h_150,w_150/rotate,0`
      } else {
        // 本地磁盘存储
        let index = row.fileUrl.lastIndexOf('.')
        fileUrl = '/api' + row.fileUrl.substr(0, index) + '_min' + row.fileUrl.substr(index)
      }
    }
    return fileUrl
  },
  /**
   * 获取文件查看路径
   * @param {object} row 文件信息
   * @returns {string} 文件路径
   */
  getViewFilePath: function (row) {
    let fileUrl = ''
    if (Number(row.isOSS) === 1) {
      fileUrl = `https://${Cookies.get('viewDomain')}${row.fileUrl}`  // 阿里云OSS对象存储
    } else {
      fileUrl = `/api/filetransfer/preview?userFileId=${row.userFileId}`  // 本地磁盘存储
    }
    return fileUrl
  },
  /**
   * 获取文件下载路径
   * @param {object} row 文件信息
   * @returns {string}  文件下载路径
   */
  getDownloadFilePath: function (row) {
    return `/api/filetransfer/downloadfile?userFileId=${row.userFileId}`
  },
  /**
   * 获取 office 文件在线预览路径
   * @param {object} row 
   * @returns {string} office 文件在线预览路径
   */
  getFileOnlineViewPathByOffice: function (row) {
    let fileUrl = ''
    if (row.isOSS == 1) {
      fileUrl = `https://${Cookies.get('viewDomain')}${row.fileUrl}`  // 阿里云OSS对象存储
    } else {
      // 本地磁盘存储 - 在本地开发环境中，本地磁盘存储的文件是无法预览的，因为 office 要求文件可以在 Internet 访问
      fileUrl = `${location.protocol}//${location.host}/api${row.fileUrl}`
    }
    return `https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`
  },
  /**
   * 设置 Cookies
   * @param {string} name 名称
   * @param {string} value 值
   * @param {object} others 域名、路径、有效期等，封装到对象中
   */
  setCookies: function (name, value, others = null) {
    Cookies.set(name, value, { domain: config.domain, ...others })
  },
  /**
   * 获取 Cookies
   * @param {string} name 名称
   * @param {object} others 域名、路径等，封装到对象中
   * @returns {string} Cookies 值
   */
  getCookies: function (name, others = null) {
    return Cookies.get(name, { domain: config.domain, ...others })
  },
  /**
   * 移除 Cookies
   * @param {string} name 名称
   * @param {object} others 域名、路径等，封装到对象中
   */
  removeCookies: function (name, others = null) {
    Cookies.remove(name, { domain: config.domain, ...others })
  },
  /**
   * 获取分享链接
   * @param {string} shareBatchNum 
   * @returns {string} 完整的分享链接
   */
  getShareLink: function (shareBatchNum) {
    return `${location.protocol}//${location.host}/share/${shareBatchNum}`
  },
  /**
   * 复制分享链接
   * @param {string} shareBatchNum 
   * @param {string} extractionCode 
   */
  copyShareLink: function (shareBatchNum, extractionCode) {
    let input = document.createElement('textarea') // 直接构建textarea以保持换行
      input.value =
        extractionCode === null
          ? `分享链接：${this.getShareLink(
              shareBatchNum
            )}\n复制链接到浏览器中并输入提取码即可查看文件`
          : `分享链接：${this.getShareLink(shareBatchNum)}\n提取码：${
              extractionCode
            }\n复制链接到浏览器中并输入提取码即可查看文件` // 设置内容
      document.body.appendChild(input) // 添加临时实例
      input.select() // 选择实例内容
      document.execCommand('Copy') // 执行复制
      document.body.removeChild(input) // 删除临时实例
      Message.success('复制成功')
  }
}

export default globalFunction
