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
				size="medium"
				type="text"
				icon="el-icon-arrow-up"
				:disabled="activeNoticeIndex === 0"
				@click="handleChangePage('up')"
			></el-button>
			<div class="page-count">
				{{ activeNoticeIndex + 1 }} / {{ noticeList.length }}
			</div>
			<el-button
				class="change-btn"
				size="medium"
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

<script>
import { getNoticeList } from '_r/home.js'

export default {
	name: 'Notice',
	data() {
		return {
			noticeImg: require('_a/images/home/notice/noticeTip.png'),
			activeNoticeIndex: 0,
			noticeList: [],
			noticeIntervalTimer: null
		}
	},
	mounted() {
		this.getNoticeListData()
	},
	methods: {
		/**
		 * 获取公告列表
		 */
		getNoticeListData() {
			getNoticeList().then((res) => {
				if (res.success) {
					this.noticeList = res.data.list.slice(0, 3)
					this.setNoticeInterval()
				}
			})
		},
		/**
		 * 设置公告轮播效果
		 */
		setNoticeInterval() {
			this.noticeIntervalTimer = setInterval(() => {
				if (this.activeNoticeIndex < this.noticeList.length - 1) {
					this.activeNoticeIndex++
				} else {
					this.activeNoticeIndex = 0
				}
			}, 3000)
		},
		/**
		 * 手动切换公告
		 * @description 停止计时器，修改当前公告索引，再开启计时器
		 */
		handleChangePage(type) {
			clearInterval(this.noticeIntervalTimer)
			if (type === 'up') {
				this.activeNoticeIndex--
			} else if (type === 'down') {
				this.activeNoticeIndex++
			}
			this.setNoticeInterval()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

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
      line-height: 40px
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
          setEllipsis(1)
        }
      }
    }
    .change-btn {
      ::v-deep i[class^=el-icon-] {
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
