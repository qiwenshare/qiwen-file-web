export default {
  state: {
    visible: false,
    fileUrl: '',
    fileName: '',
    extendName: '',
    isOSS: 0
  },
  mutations: {
    setImgReviewData(state, data) {
      if(data.visible) {
        state.visible = data.visible
        state.fileUrl = data.fileUrl
        state.fileName = data.fileName
        state.extendName = data.extendName
        state.isOSS = data.isOSS
      } else {
        state.visible = data.false
        state.fileUrl = ''
        state.fileName = ''
        state.extendName = ''
        state.isOSS = 0
      }
    }
  },
  actions: {
  }
}
