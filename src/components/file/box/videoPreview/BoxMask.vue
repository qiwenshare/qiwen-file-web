<template>
	<transition name="el-zoom-in-top">
		<div class="video-preview-wrapper" v-show="visible">
			<div class="top">
				<div class="video-name">
					{{ activeFileObj.fileName }}.{{ activeFileObj.extendName }}
					<span class="size">{{
						calculateFileSize(activeFileObj.fileSize)
					}}</span>
				</div>
				<a
					class="download-link"
					:href="getDownloadFilePath(activeFileObj)"
					target="_blank"
					><i class="download-icon el-icon-download" title="下载"></i
				></a>
				<i
					class="fold-icon"
					:class="isFoldVideoList ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
					:title="isFoldVideoList ? '展开播放列表' : '折叠播放列表'"
					@click="isFoldVideoList = !isFoldVideoList"
				></i>
				<i
					class="close-icon el-icon-close"
					title="关闭"
					@click="handleClosePreview"
				></i>
			</div>
			<div class="bottom">
				<video-player
					class="video-player"
					ref="VideoPlayer"
					:options="playerOptions"
					v-if="visible"
				></video-player>
				<el-collapse-transition>
					<div class="video-list-wrapper" v-show="!isFoldVideoList">
						<div class="list-title">播放列表</div>
						<ul class="video-list">
							<li
								class="video-item"
								v-for="(item, index) in videoList"
								:key="index"
								:class="[activeIndex === index ? 'active' : '']"
								@click="activeIndex = index"
							>
								<span class="name"
									>{{ item.fileName }}.{{ item.extendName }}</span
								>
								<span class="size">{{ calculateFileSize(item.fileSize) }}</span>
							</li>
						</ul>
					</div>
				</el-collapse-transition>
			</div>
		</div>
	</transition>
</template>

<script>
import VideoPlayer from './VideoPlayer.vue'
import store from '@/store/index.js'

export default {
	name: 'VideoPreview',
	components: {
		VideoPlayer
	},
	data() {
		return {
			visible: false, //  视频预览组件是否可见
			activeIndex: 0, //  当前打开的视频索引
			isFoldVideoList: false //  是否折叠右侧视频列表
		}
	},
	computed: {
		// 当前显示的文件信息
		activeFileObj() {
			return this.videoList.length ? this.videoList[this.activeIndex] : {}
		},
		// 播放器配置项
		playerOptions() {
			return {
				playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
				autoplay: false, //  如果true,浏览器准备好时开始播放。
				muted: false, // 默认情况下将会消除任何音频。
				loop: false, // 导致视频一结束就重新开始。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
				fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
				sources: [
					{
						type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
						src: this.videoList[this.activeIndex].fileUrl // url地址
					}
				],
				notSupportedMessage: '此视频暂无法播放，请稍后再试',
				controls: true,
				controlBar: {
					timeDivider: true,
					durationDisplay: true,
					remainingTimeDisplay: false,
					fullscreenToggle: true // 全屏按钮
				}
			}
		},
		// 屏幕宽度
		screenWidth() {
			return store.state.common.screenWidth
		}
	},
	watch: {
		// 监听视频预览组件状态
		visible(newValue) {
			if (newValue) {
				this.activeIndex = this.defaultIndex
			}
		},
		screenWidth(newValue) {
			if (newValue <= 768) {
				this.isFoldVideoList = true
			}
		}
	},
	mounted() {
		if (this.screenWidth <= 768) {
			this.isFoldVideoList = true
		}
	},
	methods: {
		// 关闭视频预览
		handleClosePreview() {
			this.visible = false
			this.callback('cancel')
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.video-preview-wrapper {
  background: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;

  .top {
    margin-bottom: 8px;
    background: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    line-height: 48px;
    padding: 0 8px 0 16px;

    .video-name {
      flex: 1;
      color: #fff;

      .size {
        margin-left: 16px;
        color: $SecondaryText;
        font-size: 12px;
      }
    }

    .download-link {
      display: block;
      height: 24px;
      line-height: 24px;
    }

    .download-icon, .fold-icon, .close-icon {
      margin-left: 8px;
      width: 32px;
      cursor: pointer;
      font-size: 24px;
      color: #fff;

      &:hover {
        opacity: 0.6;
      }
    }
  }

  .bottom {
    height: calc(100vh - 60px);
    display: flex;
    justify-content: space-between;

    .video-player {
      flex: 1;
      width: 100%;
      height: 100%;
      object-fit: fill;
    }

    .video-list-wrapper {
      margin-left: 8px;
      background: #000;
      width: 280px;
      height: 100%;
      color: #fff;

      .list-title {
        border-bottom: 2px solid $RegularText;
        height: 40px;
        line-height: 40px;
        padding: 0 16px;
      }

      .video-list {
        padding: 8px 0;
        font-size: 12px;
        cursor: pointer;
        height: calc(100% - 42px);
        overflow: auto;
        list-style: none;
        setScrollbar(8px);

        .video-item {
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;

          &:hover {
            color: $Primary;
          }

          .name {
            flex: 1;
            word-break: break-all;
          }

          .size {
            margin-left: 8px;
            width: 56px;
            color: $SecondaryText;
            text-align: right;
          }
        }

        .video-item.active {
          background: #000;
          color: $Primary;
        }
      }
    }
  }
}
</style>
