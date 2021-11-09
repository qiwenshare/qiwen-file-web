<template>
	<div class="footer-wrapper">
		<div class="copy-right-wrapper">
			<img
				class="logo"
				:src="logoUrl"
				:alt="$store.getters.imgAlt + 'footerLogo'"
			/>
			<div class="copy-right">
				<span>奇文共赏 2020 版权所有</span>
				<span class="split">|</span>
				<span
					><a
						class="link"
						style="color: white"
						href="http://beian.miit.gov.cn/"
						target="_blank"
						>陕ICP备19020251号</a
					>&nbsp;</span
				>
				<p class="tip-website">
					为获得最佳浏览体验，建议使用IE11、FireFox50.5、Chrome51.0及以上版本的浏览器
				</p>
			</div>
		</div>
		<div class="join-us">
			<div class="desc">如果你也是对技术感兴趣的小伙伴，欢迎加入我们</div>
			<ul class="join-list">
				<li class="join-item" v-for="(item, index) in joinList" :key="index">
					<el-popover placement="top" trigger="hover">
						<img
							class="img"
							:src="item.img"
							:alt="`${$store.getters.imgAlt} ${item.title}`"
							style="width: 130px"
						/>
						<i
							slot="reference"
							:class="`iconfont ${item.logo} ${item.class}`"
						></i>
					</el-popover>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Footer',
	data() {
		return {
			logoUrl: require('_a/images/common/logo_footer.png'),
			joinList: [
				{
					class: 'qq',
					logo: 'icon-qq',
					img: require('_a/images/footer/QQImg.png'),
					title: 'QQ群'
				},
				{
					class: 'wechat',
					logo: 'icon-weixin-copy',
					img: require('_a/images/footer/wechatImg.png'),
					title: '微信公众号'
				},
				{
					class: 'gitee',
					logo: 'icon-mayun',
					img: require('_a/images/footer/giteeImg.png'),
					title: '码云 开源社区'
				}
			]
		}
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';

.footer-wrapper {
  margin-top: 20px;
  display: flex;

  .copy-right-wrapper {
    width: 65%;
    color: $BorderLight;
    background: linear-gradient(to right, $Primary, #66b1ff);
    padding: 16px 0 16px 5vw;
    font-size: 14px;
    color: $BorderLight;
    display: flex;
    align-items: center;

    .logo {
      width: 240px;
      display: block;
    }

    .split {
      margin: 0 8px;
    }

    .link {
      &:hover {
        text-decoration: underline;
      }
    }

    .tip-website {
      padding-top: 8px;
    }
  }

  .join-us {
    background: linear-gradient(to right, $Placeholder, $Info);
    width: 35%;
    padding: 16px 5vw 16px 40px;
    color: #fff;

    .join-list {
      margin-top: 16px;
      display: flex;

      .join-item {
        .iconfont {
          margin-right: 16px;
          font-size: 30px;
          cursor: pointer;
        }

        .qq {
          &:hover {
            color: $Primary;
          }
        }

        .wechat {
          &:hover {
            color: $Success;
          }
        }

        .gitee {
          &:hover {
            color: #c71d24;
          }
        }
      }
    }
  }
}
</style>
