<template>
  <div
    class="img-review-wrapper"
    v-show="imgReviewVisible"
    @click.self="closeImgReview"
    @mousewheel.prevent="rollImg()"
  >
    <!-- 顶部信息栏 & 工具栏 -->
    <div class="tip-wrapper" v-if="imgReviewVisible">
      <div class="name" :title="activeFileName + activeExtendName">{{ activeFileName }}.{{ activeExtendName }}</div>
      <div class="opera-btn-group">
        <el-input-number v-model="inputActiveIndex" :min="1" :max="imgReviewList.length" size="mini"></el-input-number>
        <span class="split-line">/</span>{{ imgReviewList.length }}
      </div>
      <div class="tool-wrapper">
        <i class="item el-icon-refresh-right" title="向右旋转" @click="rotateImg"></i>
        <a
          class="item download-link"
          target="_blank"
          :href="activeDownloadLink"
          :download="activeFileName + '.' + activeExtendName"
        >
          <i class="el-icon-download" title="保存到本地"></i>
        </a>
        <el-tooltip effect="dark" placement="bottom">
          <div slot="content">
            操作提示：<br />
            点击图片以外的区域可退出查看；<br />
            按Esc键可退出查看；<br />
            鼠标滚轮可放大缩小图片
          </div>
          <div class="item text-wrapper">
            <span class="text">操作提示</span>
            <i class="el-icon-question"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
    <!-- 大图查看 -->
    <img
      class="img-large"
      ref="imgLarge"
      v-for="(item, index) in imgReviewList"
      :key="index"
      :src="item.fileUrl"
      v-show="index === activeIndex"
    />
    <!-- 左右切换图标 -->
    <i class="pre-icon el-icon-arrow-left" title="上一张" v-show="activeIndex > 0" @click.stop="activeIndex--"></i>
    <i
      class="next-icon el-icon-arrow-right"
      title="下一张"
      v-show="activeIndex < imgReviewList.length - 1"
      @click.stop="activeIndex++"
    ></i>
    <!-- 底部显示放大缩小比例 -->
    <div class="zoom-bar">
      <el-slider
        v-model="imgZoom"
        :min="imgZoomMin"
        :max="imgZoomMax"
        :format-tooltip="formatZoom"
        @input="changeZoom"
      ></el-slider>
      <div class="zoom-count">{{ imgZoom }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgReview',
  data() {
    return {
      rotate: 0, //  旋转角度
      activeIndex: 0, //  当前图片索引 从 0 开始
      imgZoom: 100, //  图片缩放比例
      imgZoomMin: 1, //  图片缩放最小比例
      imgZoomMax: 200 //  图片缩放最大比例
    }
  },
  computed: {
    // 图片查看组件是否显示
    imgReviewVisible() {
      return this.$store.state.imgReview.imgReviewVisible
    },
    // 图片列表
    imgReviewList() {
      return this.$store.state.imgReview.imgReviewList
    },
    // 默认显示的图片索引 从 0 开始
    defaultActiveIndex() {
      return this.$store.state.imgReview.defaultActiveIndex
    },
    // 当前显示的图片名称
    activeFileName() {
      return this.imgReviewList[this.activeIndex].fileName
    },
    // 当前显示的图片扩展名
    activeExtendName() {
      return this.imgReviewList[this.activeIndex].extendName
    },
    // 对用户而言 显示的图片索引 从 1 开始 顶部栏输入框控制此值变化
    inputActiveIndex: {
      get() {
        return this.activeIndex + 1
      },
      set(value) {
        this.activeIndex = value - 1
      }
    },
    // 当前显示的图片下载链接
    activeDownloadLink() {
      return this.imgReviewList[this.activeIndex].downloadLink
    }
  },
  watch: {
    // 监听 图片查看组件 显隐状态变化
    imgReviewVisible(val) {
      let body = document.querySelector('body')
      if (val) {
        this.activeIndex = this.defaultActiveIndex
        // 挂在body下，防止组件元素有样式transform而使position: fixed失效
        body.appendChild(this.$el)
        body.style.overflow = 'hidden'
        // 添加键盘Esc事件
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.closeImgReview()
            }
          })
        })
        this.$nextTick(() => {
          this.$refs.imgLarge[this.activeIndex].style.zoom = '100%'
        })
      } else {
        body.style.overflow = 'auto'
        document.removeEventListener('keyup', (e) => {
          if (e.keyCode === 27) {
            this.closeImgReview()
          }
        })
      }
    },
    // 监听 图片索引变化
    activeIndex(newValue) {
      this.rotate = 0
      this.$nextTick(() => {
        if (this.$refs.imgLarge[newValue].style.zoom) {
          this.imgZoom = Number(this.$refs.imgLarge[newValue].style.zoom.split('%')[0])
        } else {
          this.$refs.imgLarge[newValue].style.zoom = '100%'
          this.imgZoom = 100
        }
      })
    }
  },
  methods: {
    //  关闭图片预览
    closeImgReview() {
      this.$store.commit('setImgReviewData', { imgReviewVisible: false })
      this.rotate = 0
      this.$refs.imgLarge[this.activeIndex].style.transform = `rotate(${this.rotate}deg)`
    },
    // 格式化缩放数字 显示图片缩放比例
    formatZoom(value) {
      return value + '%'
    },
    // 图片缩放改变事件
    changeZoom(value) {
      if (this.$refs.imgLarge) {
        this.$refs.imgLarge[this.activeIndex].style.zoom = value + '%'
      }
    },
    // 缩放图片
    rollImg() {
      let zoom = parseInt(this.$refs.imgLarge[this.activeIndex].style.zoom) || 100
      zoom += event.wheelDelta / 12
      if (zoom >= this.imgZoomMin && zoom < this.imgZoomMax) {
        this.imgZoom = zoom
        this.$refs.imgLarge[this.activeIndex].style.zoom = zoom + '%'
      }
      return false
    },
    //  旋转图片
    rotateImg() {
      this.rotate += 90
      this.$refs.imgLarge[this.activeIndex].style.transform = `rotate(${this.rotate}deg)`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'

.img-review-wrapper
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  overflow auto
  width 100%
  height 100%
  z-index 2010
  text-align center
  display flex
  align-items center
  animation imgReviewAnimation 0.3s
  -webkit-animation imgReviewAnimation 0.3s /* Safari and Chrome */
  animation-iteration-count 0.3
  -webkit-animation-iteration-count 0.3
  animation-fill-mode forwards
  -webkit-animation-fill-mode forwards /* Safari 和 Chrome */
  @keyframes imgReviewAnimation
    0%
      background transparent
    100%
      background rgba(0, 0, 0, 0.8)
  @keyframes imgReviewAnimation
    0%
      background transparent
    100%
      background rgba(0, 0, 0, 0.8)
  .tip-wrapper
    position fixed
    top 0
    left 0
    z-index 2011
    background rgba(0, 0, 0, 0.5)
    padding 0 48px
    width 100%
    height 48px
    line-height 48px
    color #fff
    font-size 16px
    display flex
    justify-content space-between
    .name
      flex 1
      padding-right 16px
      text-align left
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .opera-btn-group
      width 100px
      display flex
      >>> .el-input-number
        width 40px
        .el-input-number__decrease,
        .el-input-number__increase
          display none
        .el-input__inner
          margin-top 14px
          background rgba(0, 0, 0, 0.5)
          height 20px
          line-height 20px
          padding 0
          font-size 16px
          color #fff
      .split-line
        margin 0 8px
    .tool-wrapper
      flex 1
      display flex
      justify-content flex-end
      .item
        margin-left 16px
        cursor pointer
        &:hover
          opacity 0.7
      .el-icon-refresh-right
        line-height 48px
        font-size 18px
      .download-link
        color inherit
        font-size 18px
      .text-wrapper
        margin-left 32px
        .text
          margin-right 8px
  .img-large
    margin 0 auto
    transition transform 0.5s
    -webkit-transition transform 0.5s /* Safari */
  .pre-icon,
  .next-icon
    font-size 60px
    color #fff
    position fixed
    top 50%
    cursor pointer
    &:hover
      opacity 0.7
  .pre-icon
    left 64px
  .next-icon
    right 64px
  .zoom-bar
    position fixed
    right 0
    bottom 20px
    left 0
    margin 0 auto
    width 600px
    display flex
    >>> .el-slider
      flex 1
      .el-slider__bar
        background $PrimaryText
      .el-slider__button
        border-color $PrimaryText
    .zoom-count
      width 60px
      height 38px
      line-height 38px
      text-align right
      color #fff
</style>
