/**
 * 存放一些静态变量、Map 等全局可用的变量
 * @author 李雅婷
 */
/**
 * 未知文件类型图标
 */
export const unknownImg = require('_a/images/file/file_unknown.png')

/**
 * 文件类型图标 Map 映射
 */
export const fileImgMap = new Map([
	['avi', require('_a/images/file/file_avi.png')],
	['chm', require('_a/images/file/file_chm.png')],
	['css', require('_a/images/file/file_css.png')],
	['csv', require('_a/images/file/file_csv.png')],
	['dmg', require('_a/images/file/file_dmg.png')],
	['dir', require('_a/images/file/dir.png')],
	['doc', require('_a/images/file/file_word.png')],
	['docx', require('_a/images/file/file_word.png')],
	['exe', require('_a/images/file/file_exe.png')],
	['html', require('_a/images/file/file_html.png')],
	['jar', require('_a/images/file/file_jar.png')],
	['java', require('_a/images/file/file_java.png')],
	['js', require('_a/images/file/file_js.png')],
	['json', require('_a/images/file/file_json.png')],
	['mp3', require('_a/images/file/file_music.png')],
	['oa', require('_a/images/file/file_oa.png')],
	['open', require('_a/images/file/file_open.png')],
	['pdf', require('_a/images/file/file_pdf.png')],
	['ppt', require('_a/images/file/file_ppt.png')],
	['pptx', require('_a/images/file/file_ppt.png')],
	['rar', require('_a/images/file/file_rar.png')],
	['rtf', require('_a/images/file/file_rtf.png')],
	['sql', require('_a/images/file/file_sql.png')],
	['svg', require('_a/images/file/file_svg.png')],
	['txt', require('_a/images/file/file_txt.png')],
	['vue', require('_a/images/file/file_vue.png')],
	['xls', require('_a/images/file/file_excel.png')],
	['xlsx', require('_a/images/file/file_excel.png')],
	['zip', require('_a/images/file/file_zip.png')]
])

/**
 * 支持使用 onlyoffice 打开的文件格式
 */
export const officeFileType = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx']

/**
 * 文件展示模式选择列表时，所有可供选择的表格列名
 */
export const allColumnList = [
	'extendName',
	'fileSize',
	'uploadTime',
	'deleteTime'
]
