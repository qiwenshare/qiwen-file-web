<template>
  <div class="footer-wrapper">
    <ScpDivider></ScpDivider>
    <div class="footer-top">
      <div class="info">
        <img class="logo" :src="logoUrl" />
        <div class="link-wrapper">
          <div class="info-website">地址：陕西省西安市雁塔区</div>
          <div class="info-email">邮箱：1162714483@qq.com &nbsp; 2435065796@qq.com</div>
          <div class="info-welcome">如果你也是对技术感兴趣的小伙伴，欢迎加入我们</div>
        </div>
      </div>
      <div class="code-2-img-wrapper">
        <div class="code-info">
          <img class="code-2-img" :src="QQImg" />
          <p class="code-2-text">QQ群</p>
        </div>
        <div class="code-info">
          <img class="code-2-img" :src="wechatImg" />
          <p class="code-2-text">微信公众号</p>
        </div>
      </div>
    </div>
    <div class="copy-right-wrapper">
      <div class="copy-right">
        <span>奇文共赏 2020 版权所有&nbsp;|&nbsp;</span>
        <span>
          <a style="color:white;" href="http://beian.miit.gov.cn/" target="_blank">陕ICP备19020251号</a>&nbsp;
        </span>
      </div>
      <div class="tip-website">为获得最佳浏览体验，建议使用IE11、FireFox50.5、Chrome51.0及以上版本的浏览器</div>
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
      logoUrl: require('@/assets/images/common/logo_footer.png'),
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
      QQImg: require('@/assets/images/footer/QQImg.png'),
      wechatImg: require('@/assets/images/footer/wechatImg.png')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.footer-wrapper
  background $Info
  margin-top 20px
  >>> .divider
    height 3px
    margin 0
  .footer-top
    width 90%
    margin 0 auto
    padding 40px 0
    display flex
    justify-content space-between
    .info
      display flex
      width 75%
      .logo
        height 126px
      .link-wrapper
        color $BorderLight
        flex 1
        padding 20px 10px 10px 40px
        line-height 40px
        .info-website
          .phone
            .phone-number
              font-size 28px
              padding-bottom 4px
            .phone-text
              text-align center
    .code-2-img-wrapper
      width 25%
      padding-top 20px
      display flex
      justify-content space-around
      .code-info
        width 36%
        text-align center
        .code-2-img
          width 90%
          height auto
          margin-bottom 10px
        .code-2-text
          width 90%
          text-align center
          color $BorderLight
          margin 0 auto
  .footer-contact
    color $BorderLight
    a
      color #a5aaa9
    .contact-top
      padding-top 20px
      line-height 30px
    .contact-bottom
      line-height 35px
  .copy-right-wrapper
    color $BorderLight
    background $Primary
    text-align center
    padding 20px 0
    font-size 14px
    color $BorderLight
</style>
