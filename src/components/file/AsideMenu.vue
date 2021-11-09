<template>
	<div class="side-menu-wrapper">
		<!-- collapse 属性：控制菜单收缩展开 -->
		<el-menu
			class="side-menu"
			:default-active="activeIndex"
			:router="true"
			:collapse="isCollapse"
		>
			<el-submenu index="myFile" class="my-file">
				<template slot="title">
					<!-- 图标均来自 Element UI 官方图标库 https://element.eleme.cn/#/zh-CN/component/icon -->
					<i class="el-icon-files"></i>
					<span slot="title">我的文件</span>
				</template>
				<el-menu-item
					index="0"
					:route="{ name: 'File', query: { fileType: 0, filePath: '/' } }"
				>
					<i class="el-icon-menu"></i>
					<span slot="title">全部</span>
				</el-menu-item>
				<el-menu-item
					index="1"
					:route="{ name: 'File', query: { fileType: 1 } }"
				>
					<i class="el-icon-picture-outline"></i>
					<span slot="title">图片</span>
				</el-menu-item>
				<el-menu-item
					index="2"
					:route="{ name: 'File', query: { fileType: 2 } }"
				>
					<i class="el-icon-document"></i>
					<span slot="title">文档</span>
				</el-menu-item>
				<el-menu-item
					index="3"
					:route="{ name: 'File', query: { fileType: 3 } }"
				>
					<i class="el-icon-video-camera"></i>
					<span slot="title">视频</span>
				</el-menu-item>
				<el-menu-item
					index="4"
					:route="{ name: 'File', query: { fileType: 4 } }"
				>
					<i class="el-icon-headset"></i>
					<span slot="title">音乐</span>
				</el-menu-item>
				<el-menu-item
					index="5"
					:route="{ name: 'File', query: { fileType: 5 } }"
				>
					<i class="el-icon-takeaway-box"></i>
					<span slot="title">其他</span>
				</el-menu-item>
			</el-submenu>
			<el-menu-item
				index="6"
				:route="{ name: 'File', query: { fileType: 6 } }"
				class="recovery"
			>
				<i class="el-icon-delete"></i>
				<span slot="title">回收站</span>
			</el-menu-item>
			<el-menu-item
				index="8"
				:route="{ name: 'File', query: { fileType: 8, filePath: '/' } }"
				class="my-share"
			>
				<i class="el-icon-share"></i>
				<span slot="title">我的分享</span>
			</el-menu-item>
		</el-menu>
		<!-- 存储信息显示 -->
		<div class="storage-wrapper" :class="{ fold: isCollapse }">
			<el-progress
				:percentage="storagePercentage"
				:color="storageColor"
				:show-text="false"
				:type="isCollapse ? 'circle' : 'line'"
				:width="32"
				:stroke-width="isCollapse ? 4 : 6"
				stroke-linecap="square"
			></el-progress>
			<div class="text" v-show="!isCollapse">
				<span class="label">存储</span>
				<span
					>{{ storageValue | storageTrans }} /
					{{ totalStorageValue | storageTrans }}</span
				>
			</div>
			<div class="text" v-show="isCollapse">
				<span>{{ storageValue | storageTrans }}</span>
			</div>
		</div>
		<!-- 展开 & 收缩分类栏 -->
		<el-tooltip
			effect="dark"
			:content="isCollapse ? '展开' : '收起'"
			placement="right"
		>
			<div
				class="aside-title"
				@click="isCollapse ? (isCollapse = false) : (isCollapse = true)"
			>
				<i
					class="icon"
					:class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
					:title="isCollapse ? '展开' : '收起'"
				></i>
			</div>
		</el-tooltip>
	</div>
</template>

<script>
export default {
	name: 'SideMenu',
	data() {
		return {
			isCollapse: false, //  控制菜单收缩展开
			// 菜单 index 和名称 Map
			myFileMenuMap: {
				0: '全部',
				1: '图片',
				2: '文档',
				3: '视频',
				4: '音乐',
				5: '其他',
				6: '回收站',
				8: '我的分享'
			},
			//  自定义进度条颜色，不同占比，进度条颜色不同
			storageColor: [
				{ color: '#67C23A', percentage: 50 },
				{ color: '#E6A23C', percentage: 80 },
				{ color: '#F56C6C', percentage: 100 }
			]
		}
	},
	computed: {
		// 当前激活菜单的 index
		activeIndex() {
			return String(this.$route.query.fileType) //  获取当前路由参数中包含的文件类型
		},
		// 存储容量
		storageValue() {
			return this.$store.state.sideMenu.storageValue
		},
		totalStorageValue() {
			return this.$store.state.sideMenu.totalStorageValue
		},
		// 存储百分比
		storagePercentage() {
			return this.totalStorageValue
				? (this.storageValue / this.totalStorageValue) * 100
				: 0
		}
	},
	watch: {
		// 监听左侧菜单切换，修改浏览器标签标题
		activeIndex(newValue) {
			document.title = `${this.myFileMenuMap[Number(newValue)]} - ${
				this.$config.siteName
			}`
		},
		// 监听收缩状态变化，存储在 localStorage 中，保证页面刷新时仍然保存设置的状态
		isCollapse(newValue) {
			localStorage.setItem('isCollapse', newValue)
		}
	},
	created() {
		this.isCollapse = localStorage.getItem('isCollapse') === 'true' //  读取保存的状态
	},
	mounted() {
		document.title = `${this.myFileMenuMap[Number(this.activeIndex)]} - ${
			this.$config.siteName
		}`
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.side-menu-wrapper {
  position: relative;
  height: calc(100vh - 61px);
  padding-right: 11px;
  .side-menu {
    // 高度设置为屏幕高度减去顶部导航栏的高度
    height: calc(100vh - 127px);
    overflow: auto;
    // 调整滚动条样式
    setScrollbar(6px, transparent, #C0C4CC);
    .el-menu-item.is-active {
      background: #ecf5ff;
    }
    .my-file, .recovery {
      box-shadow: 0 4px 12px 0 $BorderExtralight;
    }
  }
  >>> .el-menu {
    background: transparent;
  }
  // 对展开状态下的菜单设置宽度
  .side-menu:not(.el-menu--collapse) {
    width: 210px;
  }
  // 存储空间展示区
  .storage-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: 0 -2px 12px 0 $BorderExtralight;
    border-right: solid 1px #e6e6e6;
    box-sizing: border-box;
    width: calc(100% - 11px);
    height: 66px;
    padding: 16px;
    z-index: 2;
    color: $PrimaryText;
    .text {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      flex-wrap: wrap;
    }
  }
  .storage-wrapper.fold {
    padding: 0;
    >>> .el-progress--circle {
      margin: 0 auto;
      width: 32px;
      display: block;
    }
    .text {
      font-size: 12px;
      justify-content: center;
    }
  }
  // 折叠图标调整样式
  .aside-title {
    position: absolute;
    top: calc(50% - 50px);
    right: 0;
    z-index: 3;
    background: $BorderBase;
    color: #fff;
    width: 12px;
    height: 100px;
    line-height: 100px;
    cursor: pointer;
    border-radius: 0 16px 16px 0;
    &:hover {
      opacity: 0.7;
    }
    .icon {
      font-size: 12px;
    }
  }
}
</style>
