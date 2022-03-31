<template>
	<video ref="videoPlayer" class="video-js"></video>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

export default {
	name: 'VideoPlayer',
	props: {
		options: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			player: null
		}
	},
	mounted() {
		this.player = videojs(
			this.$refs.videoPlayer,
			this.options,
			function onPlayerReady() {
				console.log('onPlayerReady', this)
			}
		)
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
