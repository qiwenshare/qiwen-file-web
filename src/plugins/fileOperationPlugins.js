/**
 * 以服务的方式，将对文件的一些操作挂载到 Vue 上
 * 在 *.vue 文件中，使用 this.$addFolder 调用创建文件夹服务
 * 在 *.js 文件中，需要现在文件顶部引入 Vue ，即 import Vue from 'vue' ，然后使用 Vue.property.$addFolder 调用创建文件夹服务
 * @description 各个服务的参数传递查看服务封装对应目录下的 index.js 文件，里面注明了需要船队的参数
 * @author 李雅婷
 */

// 导入操作文件的弹窗类组件
import showAddFolderDialog from '_c/file/dialog/addFolder/index.js'
import showAddFileDialog from '_c/file/dialog/addFile/index.js'
import showMoveFileDialog from '_c/file/dialog/moveFile/index.js'
import showSaveShareFileDialog from '_c/file/dialog/saveShareFile/index.js'
import showShareFileDialog from '_c/file/dialog/shareFile/index.js'
import showUnzipFileDialog from '_c/file/dialog/unzipFile/index.js'
import showRenameFileDialog from '_c/file/dialog/renameFile/index.js'
import showDeleteFileDialog from '_c/file/dialog/deleteFile/index.js'
import showRestoreFileDialog from '_c/file/dialog/restoreFile/index.js'
// 导入操作文件的遮罩类组件
import showContextMenuBox from '_c/file/box/contextMenu/index.js'
import showImgPreviewBox from '_c/file/box/imgPreview/index.js'
import showVideoPreviewBox from '_c/file/box/videoPreview/index.js'
import showUploadFileBox from '_c/file/box/uploadFile/index.js'

const operateElement = {
	install: (Vue) => {
		// 挂载操作文件的弹窗类组件
		Vue.prototype.$addFolder = showAddFolderDialog
		Vue.prototype.$addFile = showAddFileDialog
		Vue.prototype.$moveFile = showMoveFileDialog
		Vue.prototype.$saveShareFile = showSaveShareFileDialog
		Vue.prototype.$shareFile = showShareFileDialog
		Vue.prototype.$unzipFile = showUnzipFileDialog
		Vue.prototype.$renameFile = showRenameFileDialog
		Vue.prototype.$deleteFile = showDeleteFileDialog
		Vue.prototype.$restoreFile = showRestoreFileDialog
		// 挂载操作文件的遮罩类组件
		Vue.prototype.$openContextMenu = showContextMenuBox
		Vue.prototype.$previewImg = showImgPreviewBox
		Vue.prototype.$previewVideo = showVideoPreviewBox
		Vue.prototype.$uploadFile = showUploadFileBox
	}
}
export default operateElement
