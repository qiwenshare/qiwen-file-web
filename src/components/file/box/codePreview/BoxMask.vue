<template>
	<transition name="el-fade-in-linear el-fade-in">
		<div
			class="code-preview-wrapper"
			v-show="visible"
			@keydown.s.ctrl.prevent="handleModifyFileContent"
		>
			<!-- 顶部信息栏 & 工具栏 -->
			<div class="tip-wrapper" v-if="visible">
				<div class="name" :title="$file.getFileNameComplete(fileInfo)">
					{{ $file.getFileNameComplete(fileInfo) }}
					<span class="un-save" v-show="isModify && !codeMirrorOptions.readOnly"
						>（未保存）</span
					>
				</div>
				<div class="editor-preveiw">
					在线预览{{ codeMirrorOptions.readOnly ? '' : ' & 编辑' }}
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
							操作提示: <br />
							1. 按 Esc 键可退出查看；<br />
							2. 支持在线编辑、保存、下载
						</div>
						<div class="item text-wrapper">
							<span class="text">操作提示</span>
							<i class="el-icon-s-opportunity"></i>
						</div>
					</el-tooltip>
					<i
						class="item el-icon-close"
						title="关闭预览"
						@click="closeCodePreview"
					></i>
				</div>
			</div>
			<!-- 代码编辑区域 -->
			<div class="code-editor-wrapper">
				<div class="operate-wrapper">
					<i
						class="save-icon iconfont icon-baocun"
						title="保存（ctrl+s）"
						v-show="isModify && !codeMirrorOptions.readOnly"
						@click="handleModifyFileContent"
					></i>
					<el-form
						class="editor-set-form"
						:model="codeMirrorOptions"
						:inline="true"
						size="small"
						label-position="right"
						label-suffix=":"
					>
						<el-form-item label-width="0px" class="line-wrapper">
							<el-checkbox
								v-model="codeMirrorOptions.lineWrapping"
								@change="handleChangeCodeMirrorOption"
								>自动换行</el-checkbox
							>
						</el-form-item>
						<el-form-item label-width="0px" class="font-size">
							<el-select v-model="codeMirrorCustomOptions.fontSize" filterable>
								<el-option
									v-for="(item, index) in fontSizeList"
									:key="index"
									:value="item"
									:label="`${item} px`"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label-width="80px" label="代码语言" class="lanaguage">
							<el-select
								v-model="codeMirrorOptions.mode"
								filterable
								@change="handleChangeCodeMirrorOption"
							>
								<el-option
									v-for="(value, key, index) in fileSuffixCodeModeMap"
									:key="index"
									:value="value[1].mime"
									:label="value[1].language"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="主题" label-width="56px" class="theme">
							<el-select
								v-model="codeMirrorOptions.theme"
								filterable
								@change="handleChangeCodeMirrorOption"
							>
								<el-option value="default" label="default"></el-option>
								<el-option
									v-for="(item, index) in codeMirrorThemeList"
									:key="index"
									:label="item"
									:value="item"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<codemirror
					class="code-editor"
					ref="codemirrorRef"
					v-model="codeMirrorText"
					:options="codeMirrorOptions"
					v-loading="codeMirrorLoading"
					v-if="isShow"
					:style="`font-size: ${codeMirrorCustomOptions.fontSize}px;`"
				/>
			</div>
		</div>
	</transition>
</template>

<script>
// vue-codemirror 相关，官网地址：https://github.com/surmon-china/vue-codemirror
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css' // codemirror 样式
import './theme.js' //  codemirror 高亮代码主题
import './mode.js' // codemirror 的解析语言模式
import './fold.js' //  codemirror 的代码折叠功能相关
import {
	fontSizeList,
	fileSuffixCodeModeMap,
	codeMirrorThemeList
} from '@/libs/map.js'
// 文件修改相关
import store from '@/store/index.js'
import { getFilePreview, modifyFileContent } from '_r/file.js'

export default {
	name: 'ImgPreview',
	components: {
		codemirror
	},
	data() {
		return {
			fontSizeList,
			fileSuffixCodeModeMap,
			codeMirrorThemeList,
			visible: false, // 代码预览遮罩层组件是否显示
			originalCodeText: '', // 代码原本的文本
			codeMirrorText: '', // 代码实时修改的文本
			codeMirrorLoading: false, // 代码内容是否加载中
			// codemirror 配置项，参考 https://codemirror.net/doc/manual.html#config
			codeMirrorOptions: {
				tabSize: 4, //  制表符的宽度。默认为 4。
				mode: 'text/html', //  解析当前代码的模式，参考 https://codemirror.net/mode/ 每种语言的示例页面的底部都有对应的 MIME 类型，如果当前文件后缀没有匹配的语言，按照 html 来解析
				theme: 'default', //  代码高亮主题色，其他主题色参考 https://codemirror.net/theme/
				readOnly: true, //  true 只读不可编辑 | false 可编辑 | "nocursor"（而不是简单的 true ），不允许编辑器聚焦。
				lineNumbers: true, //  是否在编辑器左侧显示行号
				line: true,
				autoCloseBrackets: true, //  自动补全括号
				foldGutter: true, //  创建带有指示可折叠块的标记的装订线
				lineWrapping: true, //  长行处理：false 滚动 | true 换行
				// 额外的装订线
				gutters: [
					'CodeMirror-linenumbers',
					'CodeMirror-foldgutter',
					'CodeMirror-lint-markers'
				]
			},
			isShow: true, //  codemirror 是否展示
			// codemirror 自定义配置项
			codeMirrorCustomOptions: {
				fontSize: 14
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
			return this.originalCodeText !== this.codeMirrorText
		}
	},
	watch: {
		// 监听代码查看组件 显隐状态变化
		visible(val) {
			if (val) {
				// codemirror 解析模式设置
				let fileSuffix = this.fileInfo.extendName.toLowerCase()
				if (fileSuffix === 'yaml') {
					fileSuffix = 'yml'
				}
				if (this.fileSuffixCodeModeMap.has(fileSuffix)) {
					this.codeMirrorOptions.mode =
						this.fileSuffixCodeModeMap.get(fileSuffix).mime
				}
				this.codeMirrorOptions.readOnly = !this.isEdit //  设置编辑器是否只读
				// codemirror 主题获取
				this.codeMirrorOptions.theme =
					localStorage.getItem('qiwen_file_codemirror_theme') || 'default'
				this.getCodeText()
				// 添加键盘 Esc 事件
				this.$nextTick(() => {
					document.addEventListener('keyup', (e) => {
						if (e.keyCode === 27) {
							this.closeCodePreview()
						}
					})
				})
			} else {
				document.removeEventListener('keyup', (e) => {
					if (e.keyCode === 27) {
						this.closeCodePreview()
					}
				})
			}
		},
		// 监听主题变化
		'codeMirrorOptions.theme'(val) {
			localStorage.setItem('qiwen_file_codemirror_theme', val)
		}
	},
	methods: {
		/**
		 * 获取代码文本内容
		 */
		getCodeText() {
			this.codeMirrorLoading = true
			getFilePreview({
				userFileId: this.fileInfo.userFileId,
				isMin: false,
				shareBatchNum: this.fileInfo.shareBatchNum,
				extractionCode: this.fileInfo.extractionCode,
				token: this.$common.getCookies(this.$config.tokenKeyName)
			}).then((res) => {
				this.codeMirrorLoading = false
				this.originalCodeText =
					typeof res === 'object' ? JSON.stringify(res) : res
				this.codeMirrorText = this.originalCodeText
			})
		},
		/**
		 * 修改代码文本内容
		 */
		handleModifyFileContent() {
			// 如果没有修改，或当前为只读状态
			if (!this.isModify || this.codeMirrorOptions.readOnly) {
				return false
			}
			this.codeMirrorLoading = true
			modifyFileContent({
				userFileId: this.fileInfo.userFileId,
				fileContent: this.codeMirrorText
			})
				.then((res) => {
					this.codeMirrorLoading = false
					if (res.success) {
						this.$message.success('已保存')
						this.getCodeText()
					} else {
						this.$message.error(res.message)
					}
				})
				.catch((err) => {
					this.codeMirrorLoading = false
					this.$message.error(err.message)
				})
		},
		/**
		 * codemirror 配置项改变时触发
		 */
		handleChangeCodeMirrorOption() {
			this.isShow = false
			this.isShow = true
		},
		/**
		 * 关闭代码预览
		 */
		closeCodePreview() {
			this.visible = false
			this.callback('cancel')
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.code-preview-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100vh;
  z-index: 2;
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

  .code-editor-wrapper {
    margin: 56px auto 0 auto;
    width: 90vw;
    height: calc(100vh - 80px);
    .operate-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid $BorderBase;
      padding: 8px 16px;
      background: #fff;
      .save-icon {
        font-size: 20px;
        cursor: pointer;
        color: $Info;
        font-weight: 550;
        &:hover {
          opacity: 0.5;
        }
      }
      .editor-set-form {
        flex: 1;
        text-align: right;
        >>> .el-form-item {
          margin-bottom: 0;
          &.font-size {
            .el-form-item__content {
              .el-select {
                width: 96px;
              }
            }
          }
          &.lanaguage {
            .el-form-item__content {
              .el-select {
                width: 120px;
              }
            }
          }
          &.theme {
            .el-form-item__content {
              .el-select {
                width: 190px;
              }
            }
          }
        }
      }
     }
    .code-editor {
      height: calc(100vh - 129px);
      >>> .CodeMirror {
        border-radius: 0 0 8px 8px;
        height: inherit;
        font-size: inherit;
        * {
          font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace !important;
        }
        .CodeMirror-vscrollbar,
        .CodeMirror-hscrollbar {
          display: none !important;
        }
        .CodeMirror-scroll {
          width: 100%;
          padding: 8px 0 0 0;
          line-height: 1.5;
          font-size: inherit;
          setScrollbar(12px, transparent, #C0C4CC);
        }
      }
    }
  }

}
</style>
