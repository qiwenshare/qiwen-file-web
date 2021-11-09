/**
 * 存放工程配置项
 * @author 李雅婷
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
	 * 网站名称
	 */
	siteName: '奇文网盘',
	/**
	 * 请求后台接口 URL 代理时的上下文
	 * @description 仅适用于本地开发环境代理时使用，
	 * 生产环境需要在 nginx 配置中将 /api/ 代理到生产环境后台地址
	 * 对应 vue.config.js 中配置的 devServer.proxy 中的代理之一
	 * 若修改了此值，请同步修改 vue.config.js 中 devServer.proxy 对应的值
	 */
	baseContext: '/api'
}

export default config
