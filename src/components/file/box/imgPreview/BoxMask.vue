<template>
	<transition name="el-fade-in-linear el-fade-in">
		<div class="img-preview-wrapper" v-show="visible">
			<!-- 顶部信息栏 & 工具栏 -->
			<div class="tip-wrapper" v-if="visible">
				<i
					class="fold-icon"
					:class="
						isShowMinImgList
							? 'no-fold el-icon-d-arrow-left'
							: 'fold el-icon-d-arrow-right'
					"
					:title="isShowMinImgList ? '折叠缩略图' : '展开缩略图'"
					@click="isShowMinImgList = !isShowMinImgList"
				></i>
				<div class="name" :title="activeImageName">
					{{ activeImageName }}
				</div>
				<div class="opera-btn-group">
					<el-input-number
						v-model="inputActiveIndex"
						:min="1"
						:max="imgList.length"
						size="mini"
						@change="handleChangeInputIndex"
					></el-input-number>
					<span class="split-line">/</span>{{ imgList.length }}
				</div>
				<div class="tool-wrapper">
					<i
						class="item el-icon-refresh-right"
						title="向右旋转"
						@click="handleRotateImg"
					></i>
					<a
						class="item download-link"
						target="_blank"
						:href="activeDownloadLink"
						:download="activeImageName"
					>
						<i class="el-icon-download" title="保存到本地"></i>
					</a>
					<el-tooltip effect="dark" placement="bottom">
						<div slot="content" style="line-height: 1.5">
							1. 点击图片以外的区域可退出预览<br />
							2. 按 Escape 键可退出预览<br />
							3. 按左、右方向键可切换为上一张、下一张图片<br />
							4. 鼠标滚轮可放大、缩小图片<br />
							5. 点击左上角
							<i class="el-icon-d-arrow-left"></i> 图标可折叠、展开缩略图<br />
						</div>
						<div class="item text-wrapper">
							<span class="text">操作提示</span>
							<i class="el-icon-s-opportunity"></i>
						</div>
					</el-tooltip>
					<i
						class="item close-icon el-icon-close"
						title="关闭预览"
						@click="handleCloseImgPreview"
					></i>
				</div>
			</div>
			<!-- 左侧缩略图 -->
			<ul class="min-img-list" ref="minImgListRef" v-show="isShowMinImgList">
				<li
					class="min-img-item"
					v-for="(item, index) in imgList"
					:key="index"
					:class="{ active: activeIndex === index }"
					:title="$file.getFileNameComplete(item)"
					ref="minImgRef"
					@click="activeIndex = index"
				>
					<img
						class="min-img"
						:src="$file.setFileImg(item)"
						:alt="`${item.fileName} 缩略图`"
					/>
				</li>
			</ul>
			<!-- 右侧预览区域 -->
			<div
				class="img-wrapper"
				:class="{ 'full-width': !isShowMinImgList }"
				@mousewheel.prevent="handleMouseWheel()"
				@click.self="handleCloseImgPreview"
			>
				<!-- 大图查看 -->
				<img
					class="img-large"
					ref="imgLarge"
					v-for="(item, index) in imgList"
					:key="index"
					:src="item.fileUrl"
					v-show="index === activeIndex"
				/>
				<!-- 左右切换图标 -->
				<i
					class="pre-icon el-icon-arrow-left"
					title="上一张"
					v-show="activeIndex > 0"
					@click.stop="handleChangeActiveImg(activeIndex - 1)"
				></i>
				<i
					class="next-icon el-icon-arrow-right"
					title="下一张"
					v-show="activeIndex < imgList.length - 1"
					@click.stop="handleChangeActiveImg(activeIndex + 1)"
				></i>
				<!-- 底部显示放大缩小比例 -->
				<div class="zoom-bar">
					<el-slider
						v-model="imgZoom"
						:min="imgZoomMin"
						:max="imgZoomMax"
						:format-tooltip="formatZoomSize"
						@input="handleZoomImg"
					></el-slider>
					<div class="zoom-count">{{ imgZoom }}%</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import store from '@/store/index.js'

export default {
	name: 'ImgPreview',
	data() {
		return {
			visible: false, //  图片预览遮罩层组件是否显示
			inputActiveIndex: 1, //  对用户而言 显示的图片索引 从 1 开始 顶部栏输入框控制此值变化
			rotate: 0, //  旋转角度
			activeIndex: 0, //  当前图片索引 从 0 开始
			imgZoom: 100, //  图片缩放比例
			imgZoomMin: 1, //  图片缩放最小比例
			imgZoomMax: 200, //  图片缩放最大比例
			isShowMinImgList: true //  是否显示缩略图列表
		}
	},
	computed: {
		activeImage() {
			return this.imgList[this.activeIndex]
		},
		activeImageName() {
			return this.$file.getFileNameComplete(this.activeImage)
		},
		imageHeight() {
			return this.activeImage.imageHeight
		},
		imageWidth() {
			return this.activeImage.imageWidth
		},
		// 当前显示的图片下载链接
		activeDownloadLink() {
			return this.activeImage.downloadLink
		},
		// 屏幕宽度
		screenWidth() {
			return store.state.common.screenWidth
		}
	},
	watch: {
		// 监听 图片查看组件 显隐状态变化
		visible(val) {
			if (val) {
				this.activeIndex = this.defaultIndex
				document.addEventListener('keyup', this.handleAddKeyupEvent) // 添加键盘相关事件
				// 获取用户是否显示缩略图的操作习惯设置
				this.isShowMinImgList =
					localStorage.getItem('qiwen_file_img_preview_show_min') === 'false'
						? false
						: true
				this.$nextTick(() => {
					this.handleCalculateImgZoom(this.activeIndex) // 确定图片缩放比例
					this.handleScrollMinImg() // 将当前查看图片对应的缩略图滚动到视野中
				})
			} else {
				// 移除键盘相关事件
				document.removeEventListener('keyup', this.handleAddKeyupEvent)
			}
		},
		// 监听 图片索引变化
		activeIndex(newValue) {
			this.rotate = 0
			this.$nextTick(() => {
				if (this.$refs.imgLarge[newValue].style.zoom) {
					this.imgZoom = Number(
						this.$refs.imgLarge[newValue].style.zoom.split('%')[0]
					)
				} else {
					// 确定图片缩放比例
					this.handleCalculateImgZoom(newValue)
				}
			})
		},
		// 监听 是否展示缩略图列表，将变化值保存在 localStorage 中
		isShowMinImgList(val) {
			localStorage.setItem('qiwen_file_img_preview_show_min', val)
		}
	},
	methods: {
		/**
		 * 顶部栏输入框绑定值被改变时触发
		 * @param {number} currentValue 当前值
		 */
		handleChangeInputIndex(currentValue) {
			this.activeIndex = currentValue - 1
			this.handleChangeActiveImg(currentValue - 1)
		},
		/**
		 * DOM 绑定 Esc 键、左方向键、右方向键的键盘按下事件
		 * @param {event} event 事件
		 */
		handleAddKeyupEvent(event) {
			switch (event.key) {
				case 'Escape': {
					this.handleCloseImgPreview() // 关闭预览
					break
				}
				case 'ArrowLeft': {
					this.handleChangeActiveImg(this.activeIndex - 1) // 切换到上一张
					break
				}
				case 'ArrowRight': {
					this.handleChangeActiveImg(this.activeIndex + 1) // 切换到下一张
					break
				}
			}
		},
		/**
		 * 计算图片缩放比例
		 */
		handleCalculateImgZoom(currentIndex) {
			// 包裹元素
			const wrapperDom = document.querySelector('.img-wrapper')
			// 宽度原比例
			const widthRate = Number(
				((wrapperDom.clientWidth - 264) / this.imageWidth).toFixed(2)
			)
			// 高度原比例
			const heightRate = Number(
				((wrapperDom.clientHeight - 80) / this.imageHeight).toFixed(2)
			)
			let zoomRate = 1 // 缩放比例
			if (widthRate >= 1 && heightRate >= 1) {
				// 原图宽、高都小于/等于包裹元素
				zoomRate = 1
			} else if (widthRate >= 1 && heightRate < 1) {
				// 原图宽小于/等于显示区域，高大于包裹元素
				zoomRate = heightRate
			} else if (widthRate < 1 && heightRate >= 1) {
				// 原图宽大于显示区域，高小于/等于包裹元素
				zoomRate = widthRate
			} else if (widthRate < 1 && heightRate < 1) {
				// 原图宽、高都大于包裹元素
				zoomRate = Math.min(widthRate, heightRate)
			}
			this.imgZoom = Number(zoomRate.toFixed(2)) * 100 //  缩放百分比
			this.$refs.imgLarge[currentIndex].style.zoom = `${this.imgZoom}%`
		},
		/**
		 * 关闭图片预览，恢复旋转角度
		 */
		handleCloseImgPreview() {
			this.rotate = 0
			this.$refs.imgLarge[
				this.activeIndex
			].style.transform = `rotate(${this.rotate}deg)`
			this.visible = false
			this.callback('cancel')
		},
		/**
		 * 格式化 tooltip message - 显示图片缩放比例
		 * @param {number} value 缩放数字
		 * @returns {string}  图片缩放比例
		 */
		formatZoomSize(value) {
			return value + '%'
		},
		/**
		 * 数据改变时触发（使用鼠标拖曳时，活动过程实时触发）
		 * @param {number} value 缩放数字
		 */
		handleZoomImg(value) {
			if (this.$refs.imgLarge) {
				this.$refs.imgLarge[this.activeIndex].style.zoom = value + '%' //  实时设置图片缩放比例
			}
		},
		/**
		 * 鼠标滚动事件
		 * @description 缩放图片
		 */
		handleMouseWheel() {
			let zoom =
				parseInt(this.$refs.imgLarge[this.activeIndex].style.zoom) || 100
			zoom += event.wheelDelta / 12
			if (zoom >= this.imgZoomMin && zoom < this.imgZoomMax) {
				this.imgZoom = zoom
				this.$refs.imgLarge[this.activeIndex].style.zoom = zoom + '%'
			}
			return false
		},
		/**
		 * 旋转图片
		 */
		handleRotateImg() {
			this.rotate += 90
			this.$refs.imgLarge[
				this.activeIndex
			].style.transform = `rotate(${this.rotate}deg)`
		},
		/**
		 * 改变当前查看的图片索引
		 */
		handleChangeActiveImg(index) {
			if (index >= 0 && index < this.imgList.length) {
				this.activeIndex = index
				this.handleScrollMinImg()
			}
		},
		/**
		 * 将缩略图中当前查看的图片缩略图滚动到视野中
		 */
		handleScrollMinImg() {
			const parentEle = this.$refs.minImgListRef //  包裹缩略图的父元素
			const activeEle = this.$refs.minImgRef[this.activeIndex] //  当前缩略图
			// 当前元素距离可视区域顶部的距离
			const currentEleTop = activeEle.offsetTop - activeEle.clientHeight
			// 当前元素距离可视区域底部的距离
			const currentEleBottom = parentEle.clientHeight - activeEle.offsetTop
			// 如果当前查看的图片缩略图有一部分在可视区域之外（之上或之下）
			if (
				currentEleBottom < activeEle.clientHeight ||
				currentEleTop < activeEle.clientHeight
			) {
				// 将父元素的滚动条向可视区域方向滚动两个图片的高度
				parentEle.scrollTop = -currentEleBottom + activeEle.clientHeight * 2
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.img-preview-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100%;
  z-index: 2;
  text-align: center;
  display: flex;
  align-items: center;
  animation: imgPreviewAnimation 0.3s;
  animation-iteration-count: 0.3;
  animation-fill-mode: forwards;

  @keyframes imgPreviewAnimation {
    0% {
      background: transparent;
    }

    100% {
      background: rgba(0, 0, 0, 0.8);
    }
  }

  .tip-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    padding-right: 48px;
    width: 100%;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fold-icon {
      margin-right: 16px;
      font-size: 24px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
      &.no-fold {
        width: 120px;
      }
      &.fold {
        width: 64px;
      }
    }

    .name {
      flex: 1;
      padding-right: 16px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .opera-btn-group {
      width: 100px;
      display: flex;

      >>> .el-input-number {
        width: 40px;

        .el-input-number__decrease, .el-input-number__increase {
          display: none;
        }

        .el-input__inner {
          margin-top: 14px;
          background: rgba(0, 0, 0, 0.5);
          height: 20px;
          line-height: 20px;
          padding: 0;
          font-size: 16px;
          color: #fff;
        }
      }

      .split-line {
        margin: 0 8px;
      }
    }

    .tool-wrapper {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .item {
        margin-left: 16px;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }

      .el-icon-refresh-right,
      .close-icon,
      .download-link {
        font-size: 18px;
      }

      .download-link {
        color: inherit;
      }

      .text-wrapper {
        margin-left: 32px;

        .text {
          margin-right: 8px;
        }
      }
    }
  }
  .min-img-list {
    position: fixed;
    top: 48px;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    height: calc(100vh - 48px);
    padding: 8px 16px;
    overflow-y: auto;
    list-style: none;
    setScrollbar(8px, transparent, #C0C4CC);

    .min-img-item {
      position: relative;
      margin-bottom: 4px;
      width: 80px;
      height: 80px;
      cursor: pointer;
      .min-img {
        width: 100%;
        height: 100%;
      }
      &:last-of-type {
        margin-bottom: 0;
      }
      &:not(.active)::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 80px;
        height: 80px;
        background: #000;
        opacity: 0.4;
      }
      &:hover {
        &:not(.active)::after {
          opacity: 0.2;
        }
      }
    }
  }
  .img-wrapper {
    position: fixed;
    top: 48px;
    right: 0;
    left: 120px;
    overflow: auto;
    height: calc(100vh - 48px);
    display: flex;
    align-items: center;
    justify-content: center;
    &.full-width {
      left: 0;
    }
    .img-large {
      margin: 0 auto;
      transition: transform 0.5s;
    }

    .pre-icon, .next-icon {
      font-size: 60px;
      color: #fff;
      position: absolute;
      top: 50%;
      cursor: pointer;
      z-index: 3;

      &:hover {
        opacity: 0.7;
      }
    }

    .pre-icon {
      left: 64px;
    }

    .next-icon {
      right: 64px;
    }

    .zoom-bar {
      position: absolute;
      right: 0;
      bottom: 20px;
      left: 0;
      margin: 0 auto;
      width: 600px;
      display: flex;

      >>> .el-slider {
        flex: 1;

        .el-slider__bar {
          background: $PrimaryText;
        }

        .el-slider__button {
          border-color: $PrimaryText;
        }
      }

      .zoom-count {
        width: 60px;
        height: 38px;
        line-height: 38px;
        text-align: right;
        color: #fff;
      }
    }
  }

}
</style>
