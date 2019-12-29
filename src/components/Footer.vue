<template>
  <div class="footer-wrapper">
    <ScpDivider></ScpDivider>
    <div class="footer-top">
      <div class="info">
        <img class="logo" :src="logoUrl" />
        <div class="link-wrapper">
          <div class="info-website">
            <div class="phone">
              <p class="phone-number">96969</p>
              <p class="phone-text">客 服 热 线</p>
            </div>
            <div class="website-address">
              <span class="address">地址：陕西省西安市雁塔区</span>
              <span class="split">|</span>
              <span class="postal-code">邮编：710054</span>
            </div>
          </div>
          <div class="info-email">
            <div>邮箱：1162714483@qq.com &nbsp; 2435065796@qq.com &nbsp; ( 9:00 — 18:00 )</div>
            <div class="cooperation-wrapper">
              <a class="link" v-for="(item,index) in footerLinkList" :key="index" :href="item.link" target="_blank">
                {{item.text}}
              </a>
            </div>
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
  name:'Footer',
  components: {
    ScpDivider
  },
  data(){
    return {
      logoUrl: require('@/assets/images/common/logo1.png'),
      footerLinkList:[
        {
          link: "javascript:;",
          text: "合作伙伴："
        },{
          link: "https://gitee.com/",
          text: "码云"
        },{
          link: "https://www.runoob.com/",
          text: "菜鸟教程"
        },{
          link: "https://element.eleme.cn/#/zh-CN/component/installation",
          text: "Element"
        },{
          link: "https://docs.spring.io/spring-boot/docs/2.1.9.RELEASE/reference/html/",
          text: "Spring Boot"
        },{
          link: "https://cn.vuejs.org/",
          text: "Vue.js"
        }
      ],
      code2Image1: require('@/assets/images/about/code2Image1.png'),
      code2Image2: require('@/assets/images/about/code2Image2.png')
    }
  },
  methods:{
    test(){
      alert(1);
    }
  },
  
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'
.footer-wrapper {
  background: $Info;
  margin-top: 20px
  >>> .divider {
    height 3px
  }
  .footer-top {
    width 1200px
    margin 0 auto
    padding 40px 0
    display flex
    justify-content space-between
    .info {
      display flex
      flex 1
      .logo {
        height 130px
      }
      .link-wrapper {
        color $BorderLight
        flex 1
        padding 0 40px 0 10px
        .info-website {
          display flex
          padding 22px 10px
          border-bottom 1px solid $BorderExtralight
          .phone {
            .phone-number {
              font-size 28px
              padding-bottom 4px
            }
            .phone-text {
              text-align center
            }  
          }
          .website-address {
            padding 26px 10px 0 20px
            .split {
              margin 0 20px
            }
          }
        }
        .info-email {
          height 65px
          padding 8px 10px
          .cooperation-wrapper  {
            display: flex;
            padding-top 6px
            .link {
              color $BorderLight
              margin-right 20px
              &:hover {
                color #fff  
              }
            }
          }
        }
      }
    }
    .code-2-img-wrapper {
      width 300px
      display flex
      justify-content space-between
      .code-info {
        width 150px
        text-align center
        .code-2-img {
          width 110px
          height 110px
          margin-bottom 10px
        }
        .code-2-text {
          width 110px
          text-align center
          color $BorderLight  
          margin 0 auto
        }
      }
    }
  }
  .footer-contact {
    color: $BorderLight;
    a {
      color: #a5aaa9;
    }
    .contact-top {
      padding-top: 20px; 
      line-height: 30px;
    }
    .contact-bottom { 
      line-height: 35px;
    }
  }
  .copy-right-wrapper {
    color $BorderLight
    background $Primary
    text-align center
    padding 20px 0
    font-size 14px
    color $BorderLight
  }
}
</style>