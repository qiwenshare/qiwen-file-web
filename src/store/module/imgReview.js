export default {
  state: {
    imgReviewVisible: false,  //  图片查看组件显隐状态
    imgReviewList: [], //  图片列表
    defaultActiveIndex: 0 //  默认当前打开的图片的索引
  },
  mutations: {
    /**
     * 存储图片预览组件所需要的数据
     * @param {object} state Vuex 的 state 对象
     * @param {object} data 图片数据
     */
    setImgReviewData(state, data) {
      if(data.imgReviewVisible) {
        state.imgReviewVisible = data.imgReviewVisible
        state.imgReviewList = data.imgReviewList
        state.defaultActiveIndex = data.activeIndex
      } else {
        state.imgReviewVisible = data.false
        state.imgReviewList = []
        state.defaultActiveIndex = 0
      }
    }
  },
  actions: {
  }
}
