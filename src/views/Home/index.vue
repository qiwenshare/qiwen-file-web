<template>
  <div class="home-swapper">
    <Banner></Banner>
    <Function></Function>

    <div class="wrap1" v-if="false">
      <div class="title">
        <h2>我们的主张</h2>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-4">
            <div class="opinion">
              <div class="img">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-1.png" />
              </div>
              <h3><span></span>企业信息无价，私有才是王道</h3>
              <p>
                提供全私有、全加密的解决方案，保证您的信息不被扫描，不被监听。
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="opinion">
              <div class="img">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-2.png" />
              </div>
              <h3><span></span>聊天和协同不是敌人，可以做伙伴</h3>
              <p>提供了一系列功能来帮助企业将聊天和协同集成在一起。</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="opinion">
              <div class="img">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-3.png" />
              </div>
              <h3><span></span>员工是伙伴，不是被夺命盯的对象</h3>
              <p>员工是伙伴，他们需要的是信任、协作，而不是被盯。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wrap2" v-if="false">
      <div class="title">
        <h2>基础聊天</h2>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <a class="feature" href="/page/feature.html #point-1">
              <div class="part-icon">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon1.png" />
              </div>
              <div class="part-text">
                <h3>一对一聊天</h3>
                <p>
                  和服务器上的任何用户开聊，收发表情、图片、截屏、文件样样在行。
                </p>
              </div>
            </a>
          </div>
          <div class="col-md-3">
            <a class="feature" href="/page/feature.html #point-2">
              <div class="part-icon">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon2.png" />
              </div>
              <div class="part-text">
                <h3>多人讨论组聊天</h3>
                <p>
                  支持多人聊天的功能，可将讨论组公开，任何成员都可以自由加入。
                </p>
              </div>
            </a>
          </div>
          <div class="col-md-3">
            <a class="feature" href="/page/feature.html #point-3">
              <div class="part-icon">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon3.png" />
              </div>
              <div class="part-text">
                <h3>丰富的消息类型</h3>
                <p>
                  支持文字、图片、文件、表情、代码、Markdown等多种消息类型。
                </p>
              </div>
            </a>
          </div>
          <div class="col-md-3">
            <a class="feature" href="/page/feature.html #point-4">
              <div class="part-icon">
                <img src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon4.png" />
              </div>
              <div class="part-text">
                <h3>消息通知</h3>
                <p>
                  多种消息通知类型，支持新消息通知栏图标闪烁、声音提醒和弹窗提醒。
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from './components/Banner.vue'
import Function from './components/Function.vue'

export default {
  name: 'Home',
  components: {
    Banner,
    Function
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.home-swapper {
  width: 100% !important;
  flex-direction column

  .wrap1 {
    .title {
      text-align: center;
      padding: 60px 0;

      h2 {
        font-size: 28px;
        font-weight: normal;
        margin: 0;
      }
    }

    .container {
      max-width: 1160px;
      height: 300px;
      margin: 0 auto;

      .row {
        margin-left: -10px;
        margin-right: -10px;

        .col-md-4 {
          width: 33.33333333%;
          padding-left: 10px;
          padding-right: 10px;
          float: left;

          .opinion {
            padding: 0 30px;
            margin-bottom: 20px;
            overflow: hidden;
            text-align: center;

            .img {
              display: inline-block;
              border-radius: 100px;
              background: linear-gradient(to right, #787cdd, #8564cd);
            }

            h3 {
              font-size: 18px;
              font-weight: normal;
              margin: 40px 0 20px;
              text-align: left;
            }

            p {
              color: #808080;
              line-height: 1.8;
              margin: 0;
              text-align: left;
            }
          }
        }
      }
    }
  }

  .wrap2 {
    background: #f6f5fb;
    padding-bottom: 40px;

    .title {
      text-align: center;
      padding: 60px 0;

      h2 {
        font-size: 28px;
        font-weight: normal;
        margin: 0;
      }
    }

    .container {
      max-width: 1160px;
      height: 330px;
      margin: 0 auto;

      .row {
        margin-left: -10px;
        margin-right: -10px;

        .col-md-3 {
          padding-left: 10px;
          padding-right: 10px;
          width: 25%;
          float: left;

          .feature {
            display: block;
            background: #fff;
            padding: 40px 20px 30px;
            margin: 0 0 20px;
            border-radius: 10px;
            text-align: center;

            .part-icon {
              display: inline-block;
              border-radius: 100%;
              background: #f6f5fb;
              padding: 15px;
              width: 100px;
              height: 100px;

              img {
                max-width: 100%;
                vertical-align: middle;
              }
            }

            .part-text {
              color: #333;
              text-align: center;

              h3 {
                color: #333;
                font-weight: normal;
                font-size: 18px;
                margin: 30px 0 20px;
              }

              p {
                color: #808080;
                margin: 0;
                text-align: left;
                line-height: 1.8;
              }
            }
          }
        }
      }
    }
  }
}
</style>
