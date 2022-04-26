<template>
	<transition name="el-fade-in-linear el-fade-in">
		<div
			class="markdown-preview-wrapper"
			v-show="visible"
			@click.self="closeMarkdownPreview"
		>
			<!-- 顶部信息栏 & 工具栏 -->
			<div class="tip-wrapper" v-if="visible">
				<div class="name" :title="$file.getFileNameComplete(fileInfo)">
					{{ $file.getFileNameComplete(fileInfo) }}
					<span class="un-save" v-show="isModify">（未保存）</span>
				</div>
				<div class="editor-preveiw">
					在线预览{{ editable ? ' & 编辑' : '' }}
				</div>
				<div class="tool-wrapper">
					<a
						class="item download-link"
						target="_blank"
						:href="$file.getDownloadFilePath(fileInfo)"
						:download="$file.getFileNameComplete(fileInfo)"
					>
						<i class="el-icon-download" title="下载"></i>
					</a>
					<el-tooltip effect="dark" placement="bottom">
						<div slot="content">
							1. 点击文档以外的区域可退出查看<br />
							2. 按 Esc 键可退出查看
						</div>
						<div class="item text-wrapper">
							<span class="text">操作提示</span>
							<i class="el-icon-s-opportunity"></i>
						</div>
					</el-tooltip>
					<i
						class="item el-icon-close"
						title="关闭预览"
						@click="closeMarkdownPreview"
					></i>
				</div>
			</div>
			<!-- mavon-editor 组件，配置项说明文档 https://www.npmjs.com/package/mavon-editor -->
			<mavonEditor
				ref="mavonEditor"
				v-model="markdownText"
				:toolbars="toolbars"
				:editable="editable"
				:toolbarsFlag="toolbarsFlag"
				:externalLink="externalLink"
				:subfield="screenWidth > 768 ? true : false"
				defaultOpen="preview"
				v-loading="markdownLoading"
				@save="handleModifyFileContent"
			></mavonEditor>
		</div>
	</transition>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 代码高亮样式表
import '_public/mavonEditor/css/tomorrow-night.css'
import '_public/mavonEditor/css/github-markdown.css'
import store from '@/store/index.js'
import { getFilePreview, modifyFileContent } from '_r/file.js'

export default {
	name: 'ImgPreview',
	components: {
		mavonEditor
	},
	data() {
		return {
			visible: false, //  markdown 预览遮罩层组件是否显示
			originalMarkdownText: '', //  markdown 原本的文本
			markdownText: '', //  markdown 实时修改的文本
			markdownLoading: false, //  markdown 内容是否加载中
			// 工具栏
			toolbars: {
				bold: true, // 粗体
				italic: true, // 斜体
				header: true, // 标题
				underline: true, // 下划线
				strikethrough: true, // 中划线
				mark: true, // 标记
				superscript: true, // 上角标
				subscript: true, // 下角标
				quote: true, // 引用
				ol: true, // 有序列表
				ul: true, // 无序列表
				link: true, // 链接
				imagelink: true, // 图片链接
				code: true, // code
				table: true, // 表格
				fullscreen: true, // 全屏编辑
				readmodel: true, // 沉浸式阅读
				htmlcode: true, // 展示html源码
				help: true, // 帮助
				/* 1.3.5 */
				undo: true, // 上一步
				redo: true, // 下一步
				trash: true, // 清空
				save: true, // 保存（触发 events 中的 save 事件）
				/* 1.4.2 */
				navigation: true, // 导航目录
				/* 2.1.8 */
				alignleft: true, // 左对齐
				aligncenter: true, // 居中
				alignright: true, // 右对齐
				/* 2.2.1 */
				subfield: true, // 单双栏模式
				preview: true // 预览
			}
		}
	},
	computed: {
		// 屏幕宽度
		screenWidth() {
			return store.state.common.screenWidth
		},
		// 是否修改
		isModify() {
			return this.originalMarkdownText !== this.markdownText
		},
		// 外链 cdn 改为本地引入
		externalLink() {
			let context =
				process.env.NODE_ENV === 'production'
					? '/' //  生产环境
					: '/' //  开发环境
			return {
				markdown_css: function () {
					// 这是你的markdown css文件路径
					return `${context}mavonEditor/css/github-markdown.css`
				},
				hljs_js: function () {
					// 这是你的hljs文件路径
					return `${context}mavonEditor/js/highlight.min.js`
				},
				hljs_css: function () {
					// 这是你的代码高亮配色文件路径
					return `${context}mavonEditor/css/tomorrow-night.css`
				},
				hljs_lang: function () {
					// 这是你的代码高亮语言解析路径
					return `${context}mavonEditor/js/lang.hljs.js`
				},
				katex_css: function () {
					// 这是你的katex配色方案路径路径
					return `${context}mavonEditor/css/katex.min.css`
				},
				katex_js: function () {
					// 这是你的katex.js路径
					return `${context}mavonEditor/js/katex.min.js`
				}
			}
		},
		// 工具栏是否展示
		toolbarsFlag() {
			return this.editable
		}
	},
	watch: {
		// 监听 markdown 查看组件 显隐状态变化
		visible(val) {
			if (val) {
				this.getMarkdownText()
				// 添加键盘 Esc 事件
				this.$nextTick(() => {
					document.addEventListener('keyup', (e) => {
						if (e.keyCode === 27) {
							this.closeMarkdownPreview()
						}
					})
				})
			} else {
				document.removeEventListener('keyup', (e) => {
					if (e.keyCode === 27) {
						this.closeMarkdownPreview()
					}
				})
			}
		}
	},
	methods: {
		/**
		 * 获取 markdown 文本内容
		 */
		getMarkdownText() {
			this.markdownLoading = true
			getFilePreview({
				userFileId: this.fileInfo.userFileId,
				isMin: false,
				shareBatchNum: this.fileInfo.shareBatchNum,
				extractionCode: this.fileInfo.extractionCode,
				token: this.$common.getCookies(this.$config.tokenKeyName)
			}).then((res) => {
				this.markdownLoading = false
				this.originalMarkdownText = res
				this.markdownText = res
			})
		},
		/**
		 * 修改 markdown 文本内容
		 */
		handleModifyFileContent() {
			this.markdownLoading = true
			modifyFileContent({
				userFileId: this.fileInfo.userFileId,
				fileContent: this.markdownText
			})
				.then((res) => {
					this.markdownLoading = false
					if (res.success) {
						this.$message.success('已保存')
						this.getMarkdownText()
					} else {
						this.$message.error(res.message)
					}
				})
				.catch((err) => {
					this.markdownLoading = false
					this.$message.error(err.message)
				})
		},
		/**
		 * 关闭 markdown 预览
		 */
		closeMarkdownPreview() {
			this.visible = false
			this.callback('cancel')
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.markdown-preview-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100vh;
  z-index: 2;
  text-align: center;
  display: flex;
  align-items: center;
  animation: imgPreviewAnimation 0.3s;
  -webkit-animation: imgPreviewAnimation 0.3s; /* Safari and Chrome */
  animation-iteration-count: 0.3;
  -webkit-animation-iteration-count: 0.3;
  animation-fill-mode: forwards;
  -webkit-animation-fill-mode: forwards; /* Safari 和 Chrome */
  @keyframes imgPreviewAnimation {
    0% {
      background: transparent;
    }
    100% {
      background: rgba(0, 0, 0, 0.8);
    }
  }
  @keyframes imgPreviewAnimation {
    0% {
      background: transparent;
    }
    100% {
      background: rgba(0, 0, 0, 0.8);
    }
  }
  .tip-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    padding: 0 48px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    .name {
      flex: 1;
      padding-right: 16px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .un-save {
        color: $Warning;
        font-size: 14px;
      }
    }
    .tool-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .item {
        margin-left: 16px;
        height: 48px;
        line-height: 48px;
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
      }
      .save-img {
        margin: 16px 0;
        width: 16px;
        height: 16px;
      }
      .download-link {
        color: inherit;
        font-size: 18px;
      }
      .text-wrapper {
        .text {
          margin-right: 8px;
        }
      }
    }
  }

  >>> .v-note-wrapper {
		box-shadow: none !important;
		border: 1px solid $BorderBase;
		.v-note-op {
			border-bottom-color: $BorderBase;
      .op-image {
        .dropdown-item:nth-of-type(2) {
          display: none;
        }
      }
		}
		.v-note-navigation-wrapper {
			.v-note-navigation-content {
				h1,
				h2,
				h3,
				h4,
				h5,
				h6 {
					color: $PrimaryText;
					&:hover {
						color: $PrimaryText;
					}
				}
			}
		}
	}
	>>> .v-note-wrapper:not(.fullscreen) {
    margin: 56px auto 0 auto;
    width: 90vw;
		height: calc(100vh - 80px);
	}
}
</style>
