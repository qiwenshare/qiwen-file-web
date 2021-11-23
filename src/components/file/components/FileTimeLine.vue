<template>
	<!-- 时间线模式 -->
	<div class="image-timeline-wrapper">
		<div class="radio">
			排序：
			<el-radio-group v-model="reverse">
				<el-radio :label="true">倒序</el-radio>
				<el-radio :label="false">正序</el-radio>
			</el-radio-group>
		</div>
		<el-timeline
			class="image-timeline-list"
			:reverse="reverse"
			v-if="imageTimelineData.length"
		>
			<el-timeline-item
				class="image-timeline-item"
				v-for="(item, index) in imageTimelineData"
				:key="index"
				:timestamp="item.uploadDate"
				color="#409EFF"
				placement="top"
			>
				<ul class="image-list">
					<li
						class="image-item"
						v-for="(image, imageIndex) in item.imageList"
						:key="`${index}-${imageIndex}`"
						:style="`width: ${gridSize + 40}px; `"
						@click="handleImgPreview(imageIndex, {}, item.imageList)"
					>
						<img
							class="image"
							:src="getImgMinPath(image)"
							:alt="getFileNameComplete(image)"
							:style="`width: ${gridSize}px; height: ${gridSize}px;`"
						/>
						<div
							class="image-name"
							v-html="getFileNameComplete(image, true)"
						></div>
					</li>
				</ul>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
export default {
	name: 'FileTimeLine',
	props: {
		// 文件列表
		fileList: {
			required: true,
			type: Array
		}
	},
	data() {
		return {
			reverse: true
		}
	},
	computed: {
		//  按年-月-日分组排序
		imageTimelineData() {
			let res = []
			//  去重，获取返回的所有日期年-月-日
			let uploadTimeSet = new Set(
				this.fileList.map((item) => item.uploadTime.split(' ')[0])
			)
			let uploadDate = [...uploadTimeSet]
			//  分组
			uploadDate.forEach((element) => {
				res.push({
					uploadDate: element,
					imageList: this.fileList.filter(
						(item) => item.uploadTime.split(' ')[0] === element
					) //  过滤
				})
			})
			return res
		},
		// 图标大小
		gridSize() {
			return this.$store.getters.gridSize
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.image-timeline-wrapper {
  margin-top: 20px;
  height: calc(100vh - 215px);
  overflow-y: auto;
  setScrollbar(6px, transparent, #C0C4CC);

  .image-timeline-list {
    margin-top: 10px;

    .image-timeline-item {
      .image-list {
        display: flex;
        flex-wrap: wrap;

        .image-item {
          margin: 0 16px 16px 0;
          padding: 8px;
          text-align: center;
          cursor: pointer;

          &:hover {
            background: $tabBackColor;

            .file-name {
              font-weight: 550;
            }
          }

          .image-name {
            margin-top: 8px;
            height: 44px;
            line-height: 22px;
            font-size: 12px;
            word-break: break-all;
            setEllipsis(2);
            >>> .keyword {
              color: $Danger;
            }
          }
        }
      }
    }
  }
}
</style>
