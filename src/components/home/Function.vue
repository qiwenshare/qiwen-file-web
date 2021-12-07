<template>
	<div class="function-wrapper">
		<div class="function-title">功能介绍</div>
		<ul class="function-list">
			<li
				class="function-item"
				v-for="(item, index) in functionList"
				:key="index"
			>
				<a
					class="function-link"
					:href="item.link"
					title="查看说明文档"
					target="_blank"
				>
					<div class="img-wrapper">
						<img class="img" :src="item.icon" />
					</div>
					<div class="content">
						<h3 class="title">{{ item.title }}</h3>
						<p class="desc">{{ item.desc }}</p>
					</div>
				</a>
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
					icon: require('_a/images/home/function/store.png'),
					title: '多种存储方式',
					desc: '使用奇文社区自研框架 ufo，支持本地磁盘、阿里云 OSS 对象存储、FastDFS 存储、MinIO 存储、七牛云 KODO 对象存储',
					link: 'https://pan.qiwenshare.com/docs/config/#%E5%AD%98%E5%82%A8%E6%96%B9%E5%BC%8F%E9%85%8D%E7%BD%AE'
				},
				{
					icon: require('_a/images/home/function/shard.png'),
					title: '分片、断点续传及极速秒传',
					desc: '集成 vue-simple-uploader，实现文件分片上传，提高上传速度；准确识别已上传文件，达到秒传效果，以分片为维度，可实现断点续传',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E4%B8%89%E7%A7%8D%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%96%B9%E5%BC%8F'
				},
				{
					icon: require('_a/images/home/function/edit.png'),
					title: '在线编辑文档',
					desc: '提供 Word, Excel, PowerPoint 文档的在线创建、在线编辑、协同编辑功能',
					link: 'https://pan.qiwenshare.com/docs/config/#%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E9%A2%84%E8%A7%88%E9%85%8D%E7%BD%AE'
				},
				{
					icon: require('_a/images/home/function/delete.png'),
					title: '回收站功能',
					desc: '回收站可以轻松帮助找回误删文件，对回收站进行清理后文件才将彻底删除',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E6%96%87%E4%BB%B6%E5%9B%9E%E6%94%B6%E7%AB%99'
				},
				{
					icon: require('_a/images/home/function/type.png'),
					title: '多种文件分类 & 查看模式',
					desc: '支持以图片、文档、视频、音乐、其他五种分类查看文件；提供了列表、网格、时间线模式，网格模式下支持手动调整图标大小',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E4%B8%89%E7%A7%8D%E6%9F%A5%E7%9C%8B%E6%A8%A1%E5%BC%8F'
				},
				{
					icon: require('_a/images/home/function/search.png'),
					title: '全局搜索',
					desc: '支持搜索文件名，快速定位文件并可以打开文件所处位置',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E6%96%87%E4%BB%B6%E6%90%9C%E7%B4%A2'
				},
				{
					icon: require('_a/images/home/function/share.png'),
					title: '分享',
					desc: '支持分享文件，设置过期时间，自动生成提取码；可查看个人分享过的文件列表',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB'
				},
				{
					icon: require('_a/images/home/function/operation.png'),
					title: '基本操作',
					desc: '支持拖拽上传文件，支持文件移动、重命名、解压缩、下载、删除、还原',
					link: 'https://pan.qiwenshare.com/docs/guide/#%E5%9F%BA%E7%A1%80%E6%93%8D%E4%BD%9C'
				},
				{
					icon: require('_a/images/home/function/preview.png'),
					title: '在线预览',
					desc: '支持图片、视频、音频在线预览，支持 Office 文件在线预览',
					link: 'https://pan.qiwenshare.com/docs/guide/function.html#%E6%96%87%E4%BB%B6%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88-%E7%BC%96%E8%BE%91'
				}
			]
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl'

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
      width: 32%;
      .function-link {
        display: block;
        border-radius: 10px;
        background: #ecf5ff;
        width: 100%;
        height: 100%
        padding: 40px;
        text-align: center;
        &:hover {
          background linear-gradient(to right bottom, $Primary, #66b1ff)
          .content {
            .title,
            .desc {
              color #fff
            }
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
        .content {
          margin-top: 32px;
          .title {
            margin 0 0 24px
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
  }
}
</style>
