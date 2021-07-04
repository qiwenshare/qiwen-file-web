<template>
<div class="report-onlyoffice">
  <div id="placeholder"></div>
</div>
</template>

<script>
import { createOfficeFile, editOfficeFile, previewOfficeFile } from '@/request/onlyoffice.js'
export default {
  name: 'report-onlyoffice',
  data () {
    return {
      fileInfo: {
        userFileId: '',
        fileId: '',
        fileName: '',
        fileUrl: '',
        filePath: '',
        extendName: ''
      },
      docEditor: null,
      platform: 'desktop'
    }
  },
  created () {
    this.judgePlatform()
  },
  mounted () {
    this.$nextTick(() => {
      let ot = this.$route.query.ot
      this.fileInfo.fileUrl = this.$route.query.fileUrl
      this.fileInfo.fileName = this.$route.query.fileName
      this.fileInfo.filePath = this.$route.query.filePath
      this.fileInfo.fileId = this.$route.query.fileId
      this.fileInfo.userFileId = this.$route.query.userFileId
      this.fileInfo.extendName = this.$route.query.extendName
      // 添加
      if (ot === 'add') {
        this.initOnlyoffice()
      } else if (ot === 'edit') {
        this.editDoc()
      } else if (ot === 'detail') {
        this.showDocDetail()
      }
    })
  },
  methods: {
    initOnlyoffice,
    initDocEditor,
    judgePlatform,
    showDocDetail,
    editDoc,
    loadOnlyOfficeAPI
  },
  destroyed () {
    this.docEditor.destroyEditor()
  }
}

function initOnlyoffice () {
  let data = {
    userFileId: this.fileInfo.userFileId,
    fileId: this.fileInfo.fileId,
    fileName: this.fileInfo.fileName,
    filePath: this.fileInfo.filePath,
    fileCategory: this.fileInfo.fileCategory,
    type: this.fileInfo.type,
    memo: this.fileInfo.memo
  }

  createOfficeFile(data).then(resp => {
    if (resp.code === 200) {
      var config = resp.data.file
      config.type = this.platform
      // config.editorConfig.callbackUrl = config.editorConfig.callbackUrl.replace('/IndexServlet', ONLYOFFICE_BASE_URL + '/IndexServlet')
      // console.log(BASE_URL)
      // console.log(config.editorConfig.callbackUrl)
      let { docserviceApiUrl } = resp.data

      this.initDocEditor(docserviceApiUrl, config)
    }
  })
}

function initDocEditor (docserviceApiUrl, config) {
  this.loadOnlyOfficeAPI(docserviceApiUrl).then(() => {
    /* global DocsAPI */
    this.docEditor = new DocsAPI.DocEditor('placeholder', config)
  })
}

function judgePlatform () {
  var platform = 'desktop'// 浏览平台
  if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
    if (window.location.href.indexOf('?mobile') < 0) {
      try {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          platform = 'mobile'
        }
      } catch (e) {}
    }
  }
  this.platform = platform
}

function showDocDetail () {

  let data = {
    userFileId: this.fileInfo.userFileId,
    previewUrl: this.fileInfo.fileUrl
  }
  
  previewOfficeFile(data).then(resp => {
    debugger
    if (resp.code === 200) {
      var config = resp.data.file
      config.type = this.platform
      let { docserviceApiUrl } = resp.data
      this.initDocEditor(docserviceApiUrl, config)
    }
  })
}
function editDoc () {
  let data = {
    userFileId: this.fileInfo.userFileId,
    previewUrl: this.fileInfo.fileUrl
  }
  editOfficeFile(data).then(resp => {
    if (resp.code === 200) {
      var config = resp.data.file
      config.type = this.platform
      let { docserviceApiUrl } = resp.data
      this.initDocEditor(docserviceApiUrl, config)
    }
  })
}

function loadOnlyOfficeAPI (src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    /* script.onerror = () => {
      reject()
    } */
  })
}
</script>

<style lang="stylus" scoped>
.report-onlyoffice {
  height: 100%;
  width: 100%;
}
#app .mainContent {
  height: 100%;
  width: 100%;
}
</style>
