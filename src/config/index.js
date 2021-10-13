/**
 * 存放项目配置
 */
const config = {
	/**
	 * @description 域名
	 *              区分生产环境和开发环境，用来存放session及一些用户配置信息（左侧菜单栏是否收缩等）
	 *              冒号之前配置生产环境域名
	 *              冒号之后配置开发环境域名，开发环境域名默认使用主机名
	 */
	domain:
		process.env.NODE_ENV === 'production'
			? location.host.indexOf('.qiwenshare.com') !== -1
				? '.qiwenshare.com'
				: ''
			: location.hostname,
	/**
	 * @description 文件展示模式选择列表时，所有可供选择的表格列名
	 */
	allColumnList: ['extendName', 'fileSize', 'uploadTime', 'deleteTime']
}

export default config
