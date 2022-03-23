<template>
	<div class="notice-wrapper">
		<div class="notice-inner">
			<img class="notice-img" :src="noticeImg" alt="平台公告" />
			<ul class="notice-list">
				<li v-for="(item, index) in noticeList" :key="index">
					<transition name="el-zoom-in-top">
						<div
							class="notice-item"
							v-show="activeNoticeIndex === index"
							@click="
								$router.push({
									name: 'NoticeDetail',
									params: { noticeId: item.noticeId }
								})
							"
						>
							<span class="notice-title">{{ item.title }}</span>
							<span class="create-time">{{ item.createTime }}</span>
						</div>
					</transition>
				</li>
			</ul>
			<el-button
				class="change-btn"
				type="text"
				icon="el-icon-arrow-up"
				:disabled="activeNoticeIndex === 0"
				@click="handleChangePage('up')"
			></el-button>
			<div class="page-count">
				{{ noticeList.length > 0 ? activeNoticeIndex + 1 : 0 }} /
				{{ noticeList.length }}
			</div>
			<el-button
				class="change-btn"
				type="text"
				icon="el-icon-arrow-down"
				:disabled="activeNoticeIndex === noticeList.length - 1"
				@click="handleChangePage('down')"
			></el-button>
			<el-divider direction="vertical"></el-divider>
			<el-button
				type="text"
				class="all-btn"
				@click="$router.push({ name: 'Notice' })"
				>查看全部</el-button
			>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getNoticeList } from '_r/home'
import noticeImg from '/images/home/notice/noticeTip.png'
import { onMounted, ref } from 'vue'

const activeNoticeIndex = ref(0)
const noticeList = ref<any[]>([])
const noticeIntervalTimer: any = ref(null)

onMounted(() => {
	getNoticeListData()
})

/**
 * 获取公告列表
 */
const getNoticeListData = () => {
	getNoticeList().then((res) => {
		if (res.success) {
			noticeList.value = res.data.list.slice(0, 3)
			setNoticeInterval()
		}
	})
}
/**
 * 设置公告轮播效果
 */
const setNoticeInterval = () => {
	noticeIntervalTimer.value = setInterval(() => {
		if (activeNoticeIndex.value < noticeList.value.length - 1) {
			activeNoticeIndex.value++
		} else {
			activeNoticeIndex.value = 0
		}
	}, 3000)
}
/**
 * 手动切换公告
 * @description 停止计时器，修改当前公告索引，再开启计时器
 */
const handleChangePage = (type: string) => {
	clearInterval(noticeIntervalTimer.value)
	if (type === 'up') {
		activeNoticeIndex.value--
	} else if (type === 'down') {
		activeNoticeIndex.value++
	}
	setNoticeInterval()
}
</script>

<style lang="scss" scoped>
@import '_a/styles/element-plus-varibles.scss';
@import '_a/styles/mixins.scss';

.notice-wrapper {
	background: $PrimaryHover;
	.notice-inner {
		margin: 0 auto;
		width: 1200px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.notice-img {
			margin-right: 8px;
			height: 24px;
		}
		.notice-list {
			height: 40px;
			line-height: 40px;
			padding-right: 24px;
			overflow: hidden;
			flex: 1;
			list-style: none;
			.notice-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: $RegularText;
				font-size: 14px;
				cursor: pointer;
				&:hover {
					color: $Primary;
				}
				.notice-title {
					padding-right: 16px;
					@include setEllipsis(1);
				}
			}
		}
		.change-btn {
			:deep(i[class^='el-icon-']) {
				font-weight: 600;
			}
		}
		.page-count {
			margin: 0 8px;
			font-size: 14px;
			color: $RegularText;
		}
	}
}
</style>
