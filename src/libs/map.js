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
	['bat', require('_a/images/file/file_bat.png')],
	['c', require('_a/images/file/file_c.png')],
	['chm', require('_a/images/file/file_chm.png')],
	['css', require('_a/images/file/file_css.png')],
	['styl', require('_a/images/file/file_stylus.png')],
	['less', require('_a/images/file/file_less.png')],
	['scss', require('_a/images/file/file_scss.png')],
	['sass', require('_a/images/file/file_sass.png')],
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
	['jsp', require('_a/images/file/file_jsp.png')],
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
	['xml', require('_a/images/file/file_xml.png')],
	['zip', require('_a/images/file/file_zip.png')],
	['md', require('_a/images/file/file_markdown.png')],
	['markdown', require('_a/images/file/file_markdown.png')]
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

/**
 * 代码语言和文件后缀映射关系
 */
export const codeFileSuffixMap = {
	C: 'c',
	'C++': 'c++',
	'C#': 'c#',
	CSS: 'css',
	Less: 'less',
	Scss: 'scss',
	Sass: 'sass',
	Stylus: 'styl',
	Java: 'java',
	JavaScript: 'js',
	XML: 'xml',
	HTML: 'html',
	SQL: 'sql'
}

/**
 * 可以用代码编辑器打开的文件后缀和 codemirror 解析模式 mode 映射关系
 */
export const fileSuffixCodeModeMap = new Map([
	['c', 'text/x-csrc'],
	['c++', 'text/x-c++src'],
	['c#', 'text/x-csharp'],
	['css', 'text/css'],
	['less', 'text/x-less'],
	['scss', 'text/x-scss'],
	['sass', 'text/x-sass'],
	['styl', 'text/x-styl'],
	['xml', 'text/xml'],
	['html', 'text/html'],
	['http', 'text/http'],
	['java', 'text/x-java'],
	['js', 'text/javascript'],
	['json', 'text/javascript'],
	['vue', 'text/x-vue'],
	['sql', 'text/x-sql']
])

/**
 * codemirror 编辑器代码高亮主题列表
 */
export const codeMirrorThemeList = [
	'3024-day',
	'3024-night',
	'abbott',
	'abcdef',
	'ambiance-mobile',
	'ambiance',
	'ayu-dark',
	'ayu-mirage',
	'base16-dark',
	'base16-light',
	'bespin',
	'blackboard',
	'cobalt',
	'colorforth',
	'darcula',
	'dracula',
	'duotone-dark',
	'duotone-light',
	'eclipse',
	'elegant',
	'erlang-dark',
	'gruvbox-dark',
	'hopscotch',
	'icecoder',
	'idea',
	'isotope',
	'juejin',
	'lesser-dark',
	'liquibyte',
	'lucario',
	'material-darker',
	'material-ocean',
	'material-palenight',
	'material',
	'mbo',
	'mdn-like',
	'midnight',
	'monokai',
	'moxer',
	'neat',
	'neo',
	'night',
	'nord',
	'oceanic-next',
	'panda-syntax',
	'paraiso-dark',
	'paraiso-light',
	'pastel-on-dark',
	'railscasts',
	'rubyblue',
	'seti',
	'shadowfox',
	'solarized',
	'ssms',
	'the-matrix',
	'tomorrow-night-bright',
	'tomorrow-night-eighties',
	'ttcn',
	'twilight',
	'vibrant-ink',
	'xq-dark',
	'xq-light',
	'yeti',
	'yonce',
	'zenburn'
]
