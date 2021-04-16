export default {
  state: {
    imgPreviewVisible: false,  //  图片查看组件显隐状态
    imgPreviewList: [], //  图片列表
    defaultActiveIndex: 0 //  默认当前打开的图片的索引
  },
  mutations: {
    /**
     * 存储图片预览组件所需要的数据
     * @param {object} state Vuex 的 state 对象
     * @param {object} data 图片数据
     */
    setImgPreviewData(state, data) {
      if(data.imgPreviewVisible) {
        state.imgPreviewVisible = data.imgPreviewVisible
        state.imgPreviewList = data.imgPreviewList
        state.defaultActiveIndex = data.activeIndex
      } else {
        state.imgPreviewVisible = data.false
        state.imgPreviewList = []
        state.defaultActiveIndex = 0
      }
    }
  },
  actions: {
  }
}
