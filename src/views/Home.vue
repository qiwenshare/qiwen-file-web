<template>
  <div class="home-swapper">
    <div style="width: 100%">
      <el-carousel height="580px" class="el-carousel">
        <el-carousel-item class="carosel-inner" v-for="item in 3" :key="item">
          <div class="item">
            <div class="carousel-wrap">
              <div class="carousel-caption">
                <h1 class="bounce animated">一款功能齐全的文件管理系统</h1>
                <ul>
                  <li>文件传输，安全快捷</li>
                  <li>在线解压缩，一触即达</li>
                  <li>回收站，防止文件误删</li>
                </ul>
                <a
                  class="swing animated"
                  href="/file"
                  >开源免费，立即体验</a
                >
                <p>
                  <a
                    class="edition"
                    href="/dynamic/xuanxuan3.3-60.html"
                  >
                    <span class="text-xuanxuan">3.3 版本</span>
                    <i></i>
                    <span class="text-xuanxuan">10月15日发布 &gt;&gt;</span>
                  </a>
                  <a
                    class="edition"
                    href="/dynamic/4.0.beta3-63.html"
                  >
                    <span class="text-xuanxuan">4.0.beta3 版本</span>
                    <i></i>
                    <span class="text-xuanxuan">12月31日发布 &gt;&gt;</span>
                  </a>
                </p>
              </div>
              <div class="carousel-img">
                <img
                  src="https://cdn.easycorp.cn/web/data/source/default/blank/banner-1.png"
                />
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>

      <div class="wrap1">
        <div class="title">
          <h2>我们的主张</h2>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <div class="opinion">
                <div class="img">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-1.png"
                  />
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
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-2.png"
                  />
                </div>
                <h3><span></span>聊天和协同不是敌人，可以做伙伴</h3>
                <p>提供了一系列功能来帮助企业将聊天和协同集成在一起。</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="opinion">
                <div class="img">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/x-about-3.png"
                  />
                </div>
                <h3><span></span>员工是伙伴，不是被夺命盯的对象</h3>
                <p>员工是伙伴，他们需要的是信任、协作，而不是被盯。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wrap2">
        <div class="title">
          <h2>基础聊天</h2>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-3">
              <a class="feature" href="/page/feature.html #point-1">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon1.png"
                  />
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
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon2.png"
                  />
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
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon3.png"
                  />
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
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon4.png"
                  />
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

      <div class="wrap3">
        <div class="title">
          <h2>特色功能</h2>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-5">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon5.png"
                  />
                </div>
                <div class="part-text">
                  <h3>卡片消息</h3>
                  <p>
                    可以将收到的链接以卡片的方式直接呈现，不用离开喧喧即可处理各种流程。
                  </p>
                </div>
              </a>
            </div>
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-6">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon6.png"
                  />
                </div>
                <div class="part-text">
                  <h3>右键菜单</h3>
                  <p>
                    通过消息的右键菜单可直接转换为管理系统中的任务、待办或者其他类型的数据。
                  </p>
                </div>
              </a>
            </div>
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-7">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon7.png"
                  />
                </div>
                <div class="part-text">
                  <h3>扩展机制</h3>
                  <p>通过SDK和扩展机制，可以对客户端做深度扩展定制。</p>
                </div>
              </a>
            </div>
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-8">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon8.png"
                  />
                </div>
                <div class="part-text">
                  <h3>单点登录</h3>
                  <p>
                    可作为应用的入口，通过单点登录，可从喧喧直接登录到第三方应用系统。
                  </p>
                </div>
              </a>
            </div>
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-9">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon9.png"
                  />
                </div>
                <div class="part-text">
                  <h3>内置web应用</h3>
                  <p>
                    直接打开WEB应用，无需再打开浏览器网页进行操作。
                  </p>
                </div>
              </a>
            </div>
            <div class="col-md-4">
              <a class="feature" href="/page/feature.html #point-10">
                <div class="part-icon">
                  <img
                    src="https://cdn.easycorp.cn/web/data/source/default/blank/xuan-icon10.png"
                  />
                </div>
                <div class="part-text">
                  <h3>WebHook</h3>
                  <p>
                    第三方的应用可以非常方便的通过HTTP接口向喧喧里面发送通知消息。
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="stylus" scoped>
.home-swapper {
  width: 100% !important;

  .el-carousel {
    width: 100%;
    // height: 580px;
    display: block;
    background: linear-gradient(to right, #6f3edd, #8960ef);

    .carosel-inner {
      width: 100%;
      // height: 580px;
      // position: relative;
      // z-index: 998;
      animation: mymove 10s infinite;

      .item {
        height: 100%;
        text-align: center;
        width: 100%;

        // position: absolute;
        .carousel-wrap {
          width: 90%;
          position: relative;
          margin-left: 5%;
          position: absolute;

          .carousel-caption {
            position: absolute;
            left: 0;
            // right: 0;
            top: 160px;
            // bottom: 0;
            // padding: 0;
            text-shadow: none;
            max-width: 550px;
            color: #fff;

            h1 {
              font-weight: normal;
              margin: 0;
              font-size: 30px;
              animation-delay: 1s;
            }

            ul {
              padding: 25px 0 25px 20px;

              li {
                line-height: 2.2;
                font-size: 15px;
              }
            }
            .swing {
                display: inline-block;
                padding: 6px 30px;
                font-size: 16px;
                color: #fff;
                border-radius: 50px;
                border: solid 2px #fff;
                animation-delay: 2.4s;
            }
            p {
                margin: 0 0 10px;
                .edition {
                    display: inline-block;
                    margin: 50px 0 0 18px;
                    color: rgba(255,255,255,0.8);
                }
            }
          }

          .carousel-img {
            max-width: 580px;
            position: absolute;
            right: 0px;
            top: 80px;

            img {
              max-width: 100%;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }

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

  .wrap3 {
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
      margin: 0 auto;

      .row {
        margin-left: -10px;
        margin-right: -10px;

        .col-md-4 {
          padding-left: 10px;
          padding-right: 10px;
          width: 33.33333333%;
          float: left;

          .feature {
            display: block;
            background: #f6f5fb;
            padding: 40px;
            margin: 0 0 20px;
            border-radius: 10px;
            text-align: center;

            .part-icon {
              display: inline-block;
              border-radius: 100%;
              background: #fff;
              padding: 15px;
              width: 100px;
              height: 100px;

              img {
                max-width: 100%;
                vertical-align: middle;
              }
            }

            .part-text {
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