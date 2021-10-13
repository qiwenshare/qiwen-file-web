<template>
	<transition name="el-zoom-in-top">
		<div class="video-preview-wrapper" v-show="videoPreviewVisible">
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
					class="video-player vjs-custom-skin"
					ref="videoPlayer"
					:playsinline="true"
					:options="playerOptions"
					v-if="videoPreviewVisible"
				></video-player>
				<el-collapse-transition>
					<div class="video-list-wrapper" v-show="!isFoldVideoList">
						<div class="list-title">播放列表</div>
						<ul class="video-list">
							<li
								class="video-item"
								v-for="(item, index) in videoPreviewList"
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
/**
 * vue-video-player 官方文档 https://github.com/surmon-china/vue-video-player
 * 此插件依赖于 video.js 官方文档 https://docs.videojs.com/
 */
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
	name: 'VideoPreview',
	components: {
		videoPlayer
	},
	data() {
		return {
			activeIndex: 0, //  当前打开的视频索引
			isFoldVideoList: false //  是否折叠右侧视频列表
		}
	},
	computed: {
		// 视频查看组件是否显示
		videoPreviewVisible() {
			return this.$store.state.videoPreview.videoPreviewVisible
		},
		// 视频列表
		videoPreviewList() {
			return this.$store.state.videoPreview.videoPreviewList
		},
		// 默认显示的视频索引 从 0 开始
		defaultActiveIndex() {
			return this.$store.state.videoPreview.defaultActiveIndex
		},
		// 当前显示的文件信息
		activeFileObj() {
			return this.videoPreviewList.length
				? this.videoPreviewList[this.activeIndex]
				: {}
		},
		// 播放器配置项
		playerOptions() {
			return {
				playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
				autoplay: true, //  如果true,浏览器准备好时开始播放。
				muted: false, // 默认情况下将会消除任何音频。
				loop: false, // 导致视频一结束就重新开始。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
				fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
				sources: [
					{
						type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
						src: this.videoPreviewList[this.activeIndex].fileUrl // url地址
					}
				],
				// poster: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=600y500', // 你的封面地址
				notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
				controlBar: {
					timeDivider: true,
					durationDisplay: true,
					remainingTimeDisplay: false,
					fullscreenToggle: true // 全屏按钮
				}
			}
		}
	},
	watch: {
		// 监听视频预览组件状态
		videoPreviewVisible(newValue) {
			if (newValue) {
				this.activeIndex = this.defaultActiveIndex
			}
		}
	},
	methods: {
		// 关闭图片预览
		handleClosePreview() {
			this.$store.commit('setVideoPreviewData', { videoPreviewVisible: false })
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

      >>> .video-js {
        width: 100%;
        height: 100%;
        padding: 0;

        .vjs-big-play-button {
          border-radius: 50%;
          width: 2em;
        }
      }
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
