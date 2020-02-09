<template>
  <div class="footer-wrapper">
    <ScpDivider></ScpDivider>
    <div class="footer-top">
      <div class="info">
        <img class="logo" :src="logoUrl" />
        <div class="link-wrapper">
          <div class="info-website">地址：陕西省西安市雁塔区</div>
          <div class="info-email">
            邮箱：1162714483@qq.com &nbsp; 2435065796@qq.com
          </div>
          <div class="friend-link-wrapper">
            <a
              class="link"
              v-for="(item, index) in footerLinkList"
              :key="index"
              :href="item.link"
              target="_blank"
              >{{ item.text }}</a
            >
          </div>
        </div>
      </div>
      <div class="code-2-img-wrapper">
        <div class="code-info">
          <img class="code-2-img" :src="code2Image1" />
          <p class="code-2-text">关注微信</p>
        </div>
        <div class="code-info">
          <img class="code-2-img" :src="code2Image2" />
          <p class="code-2-text">关注微信</p>
        </div>
      </div>
    </div>
    <div class="copy-right-wrapper">
      <div class="copy-right">
        <span>奇文共赏 2019 版权所有&nbsp;|&nbsp;</span>
        <span>陕ICP备19020251号&nbsp;|&nbsp;</span>
        <span>陕公网安备19020251号-1</span>
      </div>
      <div class="tip-website">
        为获得最佳浏览体验，建议使用IE11、FireFox50.5、Chrome51.0及以上版本的浏览器
      </div>
    </div>
  </div>
</template>

<script>
import ScpDivider from '@/components/ScpDivider'

export default {
  name: 'Footer',
  components: {
    ScpDivider
  },
  data() {
    return {
      logoUrl: require('@/assets/images/common/logo2.png'),
      footerLinkList: [
        {
          link: 'javascript:;',
          text: '友情链接：'
        },
        {
          link: 'https://gitee.com/',
          text: '码云'
        },
        {
          link: 'https://www.runoob.com/',
          text: '菜鸟教程'
        },
        {
          link: 'https://element.eleme.cn/#/zh-CN/component/installation',
          text: 'Element'
        },
        {
          link:
            'https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/',
          text: 'Spring Boot'
        },
        {
          link: 'https://cn.vuejs.org/',
          text: 'Vue.js'
        }
      ],
      code2Image1: require('@/assets/images/footer/code2Image1.png'),
      code2Image2: require('@/assets/images/footer/code2Image2.png')
    }
  },
  methods: {
    test() {
      alert(1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.footer-wrapper
  background: $Info
  margin-top: 20px
  >>> .divider
    height: 3px
    margin: 0
  .footer-top
    width: 80%
    margin: 0 auto
    padding: 40px 0
    display: flex
    justify-content: space-between
    .info
      display: flex
      width: 75%
      .logo
        height: 130px
      .link-wrapper
        color: $BorderLight
        flex: 1
        padding: 10px 10px 10px 40px
        line-height: 40px
        .info-website
          .phone
            .phone-number
              font-size: 28px
              padding-bottom: 4px
            .phone-text
              text-align: center
        .friend-link-wrapper
          display: flex
          flex-wrap: wrap
          .link
            color: $BorderLight
            margin-right: 20px
            &:hover
              color: #fff
    .code-2-img-wrapper
      width: 25%
      display: flex
      justify-content: space-between
      .code-info
        width: 50%
        text-align: center
        .code-2-img
          width: 90%
          height: auto
          margin-bottom: 10px
        .code-2-text
          width: 90%
          text-align: center
          color: $BorderLight
          margin: 0 auto
  .footer-contact
    color: $BorderLight
    a
      color: #a5aaa9
    .contact-top
      padding-top: 20px
      line-height: 30px
    .contact-bottom
      line-height: 35px
  .copy-right-wrapper
    color: $BorderLight
    background: $Primary
    text-align: center
    padding: 20px 0
    font-size: 14px
    color: $BorderLight
</style>
