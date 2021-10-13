/**
 * 存储值格式化
 * @param {number} size
 * @param {boolean} status
 * @returns {string} 存储值（带单位）
 */
const storageTrans = (size, status) => {
	const B = 1024
	const KB = Math.pow(1024, 2)
	const MB = Math.pow(1024, 3)
	const GB = Math.pow(1024, 4)
	if (status) {
		//	截取整数部分
		if (!size) {
			return 0 + 'KB'
		} else if (size < KB) {
			return (size / B).toFixed(0) + 'KB'
		} else if (size < MB) {
			return (size / KB).toFixed(0) + 'MB'
		} else if (size < GB) {
			return (size / MB).toFixed(0) + 'GB'
		} else {
			return (size / GB).toFixed(0) + 'TB'
		}
	} else {
		if (!size) {
			return 0 + 'KB'
		} else if (size < KB) {
			return (size / B).toFixed(0) + 'KB'
		} else if (size < MB) {
			return (size / KB).toFixed(2) + 'MB'
		} else if (size < GB) {
			return (size / MB).toFixed(3) + 'GB'
		} else {
			return (size / GB).toFixed(4) + 'TB'
		}
	}
}

/**
 * 文件名称拼接，包括文件名称 + 文件后缀
 * @param {object} file 文件信息
 * @returns {string} 完整文件名称
 */
const fileNameComplete = (file) => {
	return (
		file.fileName +
		(file.isDir === 0 && file.extendName ? `.${file.extendName}` : '')
	)
}

export { storageTrans, fileNameComplete }
