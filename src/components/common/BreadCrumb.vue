<template>
	<div class="breadcrumb-wrapper">
		<div class="title">当前位置：</div>
		<el-input
			class="file-path-input"
			ref="filePathInputRef"
			placeholder="请输入路径"
			v-model="inputFilePath"
			size="mini"
			:autofocus="true"
			v-show="isShowInput"
			@blur="handleInputBlurEnter"
			@change="handleInputBlurEnter"
		></el-input>
		<div
			class="breadcrumb-box"
			:class="{ 'able-input': fileType === 0 }"
			v-show="!isShowInput"
			@click.self="handleClickBreadCrumbSelf"
		>
			<el-breadcrumb
				v-if="![0, 8].includes(fileType) && !['Share'].includes($route.name)"
				separator-class="el-icon-arrow-right"
			>
				<el-breadcrumb-item>{{ fileTypeMap[fileType] }}</el-breadcrumb-item>
			</el-breadcrumb>
			<el-breadcrumb v-else separator-class="el-icon-arrow-right">
				<el-breadcrumb-item
					v-for="(item, index) in breadCrumbList"
					:key="index"
					:to="getRouteQuery(item)"
					>{{ item.name }}</el-breadcrumb-item
				>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script>
export default {
	name: 'BreadCrumb',
	props: {
		// 文件类型
		fileType: {
			required: true,
			type: Number
		},
		// 文件路径
		filePath: {
			require: true,
			type: String
		}
	},
	data() {
		return {
			fileTypeMap: {
				1: '全部图片',
				2: '全部文档',
				3: '全部视频',
				4: '全部音乐',
				5: '其他',
				6: '回收站'
			},
			isShowInput: false, //  是否展示路径输入框
			inputFilePath: '' //  路径输入
		}
	},
	computed: {
		/**
		 * 面包屑导航栏数组
		 */
		breadCrumbList: {
			get() {
				let filePath = this.$route.query.filePath
				let filePathList = filePath ? filePath.split('/') : []
				let res = [] //  返回结果数组
				let _path = [] //  存放祖先路径
				for (let i = 0; i < filePathList.length; i++) {
					if (filePathList[i]) {
						_path.push(filePathList[i])
						res.push({
							path: _path.join('/'),
							name: filePathList[i]
						})
					} else if (i === 0) {
						//  根目录
						filePathList[i] = ''
						_path.push(filePathList[i])
						res.push({
							path: '/',
							name:
								this.fileType === 0
									? '全部文件'
									: this.fileType === 8
									? '我的分享'
									: this.$route.name === 'Share'
									? '全部分享'
									: ''
						})
					}
				}
				return res
			},
			set() {
				return []
			}
		}
	},
	methods: {
		/**
		 * 点击面包屑导航栏空白处
		 */
		handleClickBreadCrumbSelf() {
			if (this.fileType === 0) {
				this.inputFilePath = this.filePath
				this.isShowInput = true
				this.$nextTick(() => {
					this.$refs.filePathInputRef.focus()
				})
			}
		},
		/**
		 * 路径输入框失去焦点或用户按下回车时触发
		 */
		handleInputBlurEnter() {
			this.isShowInput = false
			if (this.inputFilePath !== this.filePath) {
				const fixInputFilePath = this.inputFilePath.endsWith('/')
					? this.inputFilePath.slice(0, -1)
					: this.inputFilePath
				this.$router.push({
					query: { filePath: `${fixInputFilePath}`, fileType: 0 }
				})
			}
		},
		// 获取文件参数
		getRouteQuery(item) {
			let routeName = this.$route.name
			if (routeName === 'Share') {
				// 当前是查看他人分享列表的页面
				return { query: { filePath: item.path } }
			} else if (this.fileType === 8) {
				// 当前是我的已分享列表页面
				return {
					query: {
						fileType: 8,
						filePath: item.path,
						shareBatchNum:
							item.path === '/' ? undefined : this.$route.query.shareBatchNum //  当查看的是根目录，批次号置空
					}
				}
			} else {
				// 网盘页面
				return { query: { filePath: item.path, fileType: 0 } }
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.breadcrumb-wrapper {
  padding: 0;
  height: 30px;
  line-height: 30px;
  display: flex;

  .title,
  >>> .el-breadcrumb {
    height: 30px;
    line-height: 30px;
  }

  .file-path-input {
    flex: 1;
    font-size: 14px;
  }
  .breadcrumb-box {
    padding: 0 8px;
    flex: 1;
    display: flex;
    &.able-input {
      cursor: pointer;
      &:hover {
        background: $tabBackColor;
      }
    }
  }
}
</style>
