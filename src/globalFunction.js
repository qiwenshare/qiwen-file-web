import Cookies from 'js-cookie'
import config from '@/config'
import { Message } from 'element-ui';

// 全局函数
const globalFunction = {
  /**
   * 格式化文件大小
   * @param {number} size 文件大小
   * @returns {string} 文件大小（带单位）
   */
  calculateFileSize: function (size) {
    const B = 1024
    const KB = Math.pow(1024, 2)
    const MB = Math.pow(1024, 3)
    const GB = Math.pow(1024, 4)
    if (!size) {
      return '_'
    } else if (size < KB) {
      return (size / B).toFixed(0) + 'KB'
    } else if (size < MB) {
      return (size / KB).toFixed(1) + 'MB'
    } else if (size < GB) {
      return (size / MB).toFixed(2) + 'GB'
    } else {
      return (size / GB).toFixed(3) + 'TB'
    }
  },
  /**
   * 获取图片缩略图路径
   * @param {object} row 文件信息
   * @returns {string} 图片缩略图路径
   */
  getImgMinPath: function (row) {
    return `/api/filetransfer/preview?userFileId=${row.userFileId}&isMin=true&shareBatchNum=${row.shareBatchNum}&extractionCode=${row.extractionCode}&token=${globalFunction.getCookies('token')}`
  },
  /**
   * 获取文件查看路径
   * @param {object} row 文件信息
   * @returns {string} 文件路径
   */
  getViewFilePath: function (row) {
    return `/api/filetransfer/preview?userFileId=${row.userFileId}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${row.extractionCode}&token=${globalFunction.getCookies('token')}`
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
   * 获取 Onlyoffice 文件创建路径
   * @param {object} row 
   * @returns {string} office 文件创建路径
   */
  createFileOnlineByOffice: function (data) {
    let fileUrl = `${location.protocol}//${location.host}/api`
    const { href } = this.$router.resolve({
      name: 'Onlyoffice',
      query: {
        fileUrl: fileUrl,
        fileName: data.fileName,
        filePath: data.filePath,
        extendName: data.extendName,
        ot: 'add'
      }
    })
    window.open(href, '_blank')
  },
  /**
   * 获取 Onlyoffice 文件在线预览路径
   * @param {object} row 
   * @returns {string} office 文件在线预览路径
   */
  getFileOnlineViewPathByOffice: function (row) {
    let fileUrl = ''
    let fileName = row.fileName + "." + row.extendName
    let filePath = row.fileUrl
    let fileId = row.fileId
    let userFileId = row.userFileId
    let extendName = row.extendName

    fileUrl = `${location.protocol}//${location.host}/api/filetransfer/preview?userFileId=${row.userFileId}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${row.extractionCode}&token=${globalFunction.getCookies('token')}`
    const { href } = this.$router.resolve({
      name: 'Onlyoffice',
      query: {
        fileUrl: fileUrl,
        fileName: fileName,
        filePath: filePath,
        fileId: fileId,
        userFileId: userFileId,
        extendName: extendName,
        ot: 'detail'
      }
    })
    window.open(href, '_blank')
  },
  /**
   * 获取 Onlyoffice 文件在线编辑路径
   * @param {object} row 
   * @returns {string} office 文件在线编辑路径
   */
  getFileOnlineEditPathByOffice: function (row) {
    let fileUrl = ''
    let fileName = row.fileName + "." + row.extendName
    let filePath = row.fileUrl
    let fileId = row.fileId
    let userFileId = row.userFileId
    let extendName = row.extendName

    fileUrl = `${location.protocol}//${location.host}/api/filetransfer/preview?userFileId=${row.userFileId}&isMin=false&shareBatchNum=${row.shareBatchNum}&extractionCode=${row.extractionCode}&token=${globalFunction.getCookies('token')}`
    const { href } = this.$router.resolve({
      name: 'Onlyoffice',
      query: {
        fileUrl: fileUrl,
        fileName: fileName,
        filePath: filePath,
        fileId: fileId,
        userFileId: userFileId,
        extendName: extendName,
        ot: 'edit'
      }
    })
    window.open(href, '_blank')
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
        : `分享链接：${this.getShareLink(shareBatchNum)}\n提取码：${extractionCode
        }\n复制链接到浏览器中并输入提取码即可查看文件` // 设置内容
    document.body.appendChild(input) // 添加临时实例
    input.select() // 选择实例内容
    document.execCommand('Copy') // 执行复制
    document.body.removeChild(input) // 删除临时实例
    Message.success('复制成功')
  }
}

export default globalFunction
