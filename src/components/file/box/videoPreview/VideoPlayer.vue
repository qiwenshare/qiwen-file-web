<template>
	<video ref="videoPlayer" class="video-js"></video>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
	name: 'VideoPlayer',
	props: {
		source: {
			type: Object,
			default: () => {
				return {}
			}
		}
	},
	data() {
		return {
			// video.js 播放器的配置项，具体查看 https://videojs.com/getting-started
			options: {
				playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
				autoplay: false, //  如果true,浏览器准备好时开始播放。
				muted: false, // 默认情况下将会消除任何音频。
				loop: false, // 导致视频一结束就重新开始。
				preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
				language: 'zh-CN',
				aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
				fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
				sources: [this.source], //  视频源信息
				notSupportedMessage: '此视频暂无法播放，请稍后再试',
				controls: true,
				controlBar: {
					timeDivider: true,
					durationDisplay: true,
					remainingTimeDisplay: false,
					fullscreenToggle: true // 全屏按钮
				}
			},
			player: null
		}
	},
	watch: {
		/**
		 * 监听视频源信息变化
		 * @param {object} newValue 变化后的值
		 */
		source(newValue) {
			this.player.pause() //  暂停
			this.player.currentTime(0) //  跳到 0 秒
			this.player.src(newValue) //  动态设置视频源
			this.player.play() //  加载完毕后自动播放
		}
	},
	mounted() {
		this.player = videojs(this.$refs.videoPlayer, this.options)
		window.videojs = videojs
		require('video.js/dist/lang/zh-CN.js')
	},
	beforeDestroy() {
		if (this.player) {
			this.player.dispose()
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';


.video-js {
  width: 100%;
  height: 100%;
  padding: 0;
  color: $Primary;

  // 播放按钮
  >>> .vjs-big-play-button {
    border-radius: 50%;
    border: 6px solid $Primary;
    left: calc(50% - 1em);
    top: calc(50% - 1em);
    width: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    background: transparent;
    box-sizing: content-box;
    .vjs-icon-placeholder:before {
      font-size: 48px;
    }
    &:hover {
      opacity: 0.6;
    }
  }
  // 改变各种“条”的颜色
  >>> .vjs-volume-level,
  >>> .vjs-play-progress,
  >>> .vjs-slider-bar {
    background: $Primary;
  }

  // 控制条按钮的大小
  >>> .vjs-control-bar {
    font-size: 14px;
  }

}
</style>
