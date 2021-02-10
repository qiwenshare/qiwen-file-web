<template>
  <div class="function-wrapper">
    <div class="function-title">特色功能</div>
    <ul class="function-list">
      <li class="function-item" v-for="(item, index) in functionList" :key="index">
        <div class="img-wrapper">
          <img class="img" :src="item.icon" />
        </div>
        <h3 class="title">{{ item.title }}</h3>
        <p class="desc">{{ item.desc }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Function',
  data() {
    return {
      functionList: [
        {
          icon: require('@/assets/images/home/function/icon1.png'),
          title: '阿里云OSS存储',
          desc: '支持多种文件存储方式，目前已经支持本地磁盘存储和阿里云OSS存储，并可以在使用中随意切换'
        },
        {
          icon: require('@/assets/images/home/function/icon2.png'),
          title: '文件极速秒传',
          desc: '能够准确识别已上传文件，当上传的文件在磁盘上已存在，可以达到秒传效果'
        },
        {
          icon: require('@/assets/images/home/function/icon3.png'),
          title: '文件分块上传',
          desc: '对文件进行分块上传，可以提高上传速度，并且能够更加精准的显示出文件传输速率和进度'
        },
        {
          icon: require('@/assets/images/home/function/icon4.png'),
          title: '多文件格式分类查看',
          desc: '帮助用户更加快速的找到需要的文件，我们支持对文件进行分类显示并查看预览'
        },
        {
          icon: require('@/assets/images/home/function/icon5.png'),
          title: '支持回收站功能',
          desc: '回收站可以轻松帮助找回误删文件，对回收站进行清理后文件才将彻底删除'
        },
        {
          icon: require('@/assets/images/home/function/icon6.png'),
          title: '列表和网格风格切换',
          desc: '为了满足不同用户的视觉体验，我们提供了文件的列表显示和网格显示两种风格'
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl'

.function-wrapper {
  margin-bottom: 40px;

  .function-title {
    padding: 60px 0;
    text-align: center;
    font-size: 28px;
  }

  .function-list {
    max-width: 1200px;
    margin: 0 auto;
    display flex
    flex-wrap wrap
    justify-content space-between
    .function-item {
      margin-bottom 24px
      border-radius 10px
      background: #ecf5ff;
      width: 32%;
      padding: 40px;
      text-align: center;
      &:hover {
        background linear-gradient(to right, #409EFF, #66b1ff)
        .title,
        .desc {
          color #fff
        }
      }
      .img-wrapper {
        border-radius 50%
        background #fff
        margin 0 auto
        padding 15px 0
        width: 100px;
        height 100px
        .img {
          width: 70px
          height 70px
        }
      }
      .title {
        margin 32px 0 24px
        color: #333;
        font-weight: normal;
        font-size: 18px;
      }

      .desc {
        color: #808080;
      }
    }
  }
}
</style>
