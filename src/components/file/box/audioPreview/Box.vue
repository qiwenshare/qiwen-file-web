<template>
	<transition name="el-fade-in-linear">
		<div class="audio-preview-wrapper" v-show="visible">
			<div class="top">
				<i
					class="close-icon el-icon-close"
					title="关闭"
					@click="handleClosePreview"
				></i>
			</div>
			<!-- 音频名称 -->
			<div class="audio-title">
				<i class="music-icon el-icon-headset"></i>
				{{ audioObj.fileName }}.{{ audioObj.extendName }}
			</div>
			<!-- 音频组件 -->
			<audio
				class="audio-box"
				:src="$file.getViewFilePath(audioObj)"
				controls
				autoplay
			></audio>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'AudioPreview',
	data() {
		return {
			visible: false //  音频预览组件是否可见
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

.audio-preview-wrapper {
  position: fixed;
  top: 120px;
  right: 0;
  border-radius: 8px;
  box-shadow: $tabBoxShadow;
  padding: 8px 16px 16px 16px;
  background: linear-gradient(to right, $Primary, #a0cfff);
  width: 300px;
  z-index: 3;
  .top {
    margin-bottom: 8px;
    font-weight: 550;
    font-size: 18px;
    color: #fff;
    text-align: right;
    .close-icon {
      cursor: pointer;
      &:hover {
        color: $Danger;
      }
    }
  }
  .audio-title {
    margin-bottom: 16px;
    color: #fff;
    .music-icon {
      margin-right: 8px
    }
  }
  .audio-box {
    width: 100%;
    &::-webkit-media-controls-enclosure {
      background: #fff;
    }
  }
}
</style>
