export default {
  state: {
    imgReviewVisible: false,
    imgReviewList: [], //  预览图片列表
    defaultActiveIndex: 0 //  默认当前打开的图片的索引
  },
  mutations: {
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
