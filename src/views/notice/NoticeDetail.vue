<template>
	<div class="notice-detail-wrapper">
		<div class="notice-detail-inner">
			<!-- 导航栏 -->
			<el-breadcrumb
				class="notice-breadcrumb"
				separator-class="el-icon-arrow-right"
			>
				<el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ name: 'Notice' }"
					>平台公告</el-breadcrumb-item
				>
				<el-breadcrumb-item>{{ noticeDetail.title }}</el-breadcrumb-item>
			</el-breadcrumb>
			<div v-loading="loading">
				<!-- 公告详情 -->
				<h1 class="notice-title">{{ noticeDetail.title }}</h1>
				<MarkdownPreview
					class="notice-content"
					v-model="noticeDetail.content"
				></MarkdownPreview>
				<div class="create-time">创建时间：{{ noticeDetail.createTime }}</div>
				<div class="modify-time" v-show="noticeDetail.modifyTime">
					更新时间：{{ noticeDetail.modifyTime }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MarkdownPreview from '_c/common/MarkdownPreview.vue'
import { getNoticeDetail } from '_r/home.js'

export default {
	name: 'NotieDetail',
	components: {
		MarkdownPreview
	},
	data() {
		return {
			loading: false,
			noticeDetail: {}
		}
	},
	computed: {
		noticeId() {
			return this.$route.params.noticeId
		}
	},
	watch: {
		noticeId() {
			this.getNoticeDetailInfo()
		}
	},
	mounted() {
		this.getNoticeDetailInfo()
	},
	methods: {
		/**
		 * 获取公告详情
		 */
		getNoticeDetailInfo() {
			this.loading = true
			getNoticeDetail({ noticeId: this.noticeId }).then((res) => {
				this.loading = false
				if (res.success) {
					this.noticeDetail = res.data
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.notice-detail-wrapper {
  .notice-detail-inner {
    margin: 0 auto;
    width: 1200px;
    padding: 16px 0;
    .notice-breadcrumb {
      margin-bottom: 16px;
    }
    .notice-title {
      margin-bottom: 32px;
      text-align: center;
    }
    .notice-content {
      margin-bottom: 24px;
    }
    .create-time,
    .modify-time {
      margin-bottom: 8px;
      text-align: right;
      color: $RegularText;
      font-size: 14px;
    }
  }
}
</style>
