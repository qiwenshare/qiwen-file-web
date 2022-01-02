<template>
	<el-carousel height="360px" class="el-carousel">
		<el-carousel-item
			class="carosel-inner"
			v-for="(item, index) in bannerList"
			:key="index"
		>
			<div class="carousel-wrap">
				<div class="carousel-caption">
					<h1 class="bounce">{{ item.title }}</h1>
					<ul class="list">
						<li
							v-for="(descItem, descIndex) in item.descList"
							:key="`desc-${index}-${descIndex}`"
							class="item"
						>
							{{ descItem }}
						</li>
					</ul>
					<el-button type="warning" round @click="goFile">
						{{ item.btn }}
					</el-button>
					<div class="version-wrapper">
						<a
							class="version-item"
							v-for="(linkItem, linkIndex) in item.linkList"
							:key="`link-${index}-${linkIndex}`"
							:href="linkItem.link"
							:title="linkItem.link"
							target="_blank"
						>
							<span class="link-name"
								>{{ linkItem.name }} <i class="el-icon-d-arrow-right"></i
							></span>
						</a>
					</div>
				</div>
				<div class="carousel-img">
					<img :src="item.bannerImg" />
				</div>
			</div>
		</el-carousel-item>
	</el-carousel>
</template>

<script>
export default {
	name: 'Banner',
	data() {
		return {
			bannerList: [
				{
					title: '一款功能齐全的文件管理系统',
					descList: [
						'多种存储方式、支持分享文件；单个、批量操作文件、文件夹',
						'在线解压缩、在线预览、在线编辑文档',
						'支持回收站、防止文件误删、全局搜索文件'
					],
					btn: '开源免费，立即体验',
					linkList: [
						{
							name: '前端工程',
							link: 'https://gitee.com/qiwen-cloud/qiwen-file-web'
						},
						{
							name: '后台工程',
							link: 'https://gitee.com/qiwen-cloud/qiwen-file'
						},
						{
							name: '说明文档',
							link: 'https://pan.qiwenshare.com/docs/'
						}
					],
					bannerImg: require('_a/images/home/banner/banner1.png')
				}
			]
		}
	},
	methods: {
		// 跳转到网盘页面
		goFile() {
			this.$router.push({ name: 'File', query: { filePath: '/', fileType: 0 } })
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.el-carousel {
  width: 100%;
  display: block;
  background: linear-gradient(to right, #409EFF, #79bbff);

  .carosel-inner {
    width: 100%;

    .carousel-wrap {
      position: relative;
      margin: 0 auto;
      width: 85%;
      height: 100%;

      .carousel-caption {
        position: absolute;
        left: 0;
        top: 32px;
        text-shadow: none;
        max-width: 550px;
        color: #fff;
        text-align: center;

        .bounce {
          font-weight: normal;
          margin: 0;
          font-size: 26px;
          animation-delay: 1s;
        }

        .list {
          padding: 25px 0 40px 20px;
          list-style: none;

          .item {
            line-height: 2.2;
            font-size: 15px;
          }
        }

        .version-wrapper {
          margin: 24px 0 10px;

          .version-item {
            display: inline-block;
            margin: 0 0 0 18px;
            color: rgba(255, 255, 255, 0.8);

            &:hover {
              color: #fff;
            }

            .link-name {
              margin-right: 16px;
            }

            &:nth-last-of-type(1) {
              .link-name {
                margin-right: 0;
              }
            }
          }
        }
      }

      .carousel-img {
        max-width: 443px;
        position: absolute;
        right: 0px;
        top: -40px;

        img {
          max-width: 100%;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
