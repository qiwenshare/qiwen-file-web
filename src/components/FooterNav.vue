<template>
	<div class="footer-wrapper">
		<div class="copy-right-wrapper">
			<img
				class="logo"
				:src="logoUrl"
				:alt="`${globalConfig.siteName} footerLogo`"
			/>
			<div class="copy-right">
				<span>{{ webSiteName }} {{ copyrightYear }} 版权所有</span>
				<span class="split">|</span>
				<span
					><a class="link" href="http://beian.miit.gov.cn/" target="_blank">{{
						licenseNo
					}}</a
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
							:alt="`${globalConfig.siteName} ${item.title}`"
							style="width: 124px"
						/>
						<template #reference>
							<i :class="`iconfont ${item.logo} ${item.class}`"></i>
						</template>
					</el-popover>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import logoUrl from '/images/common/logo_footer.png'
import qqImg from '/images/footer/QQImg.png'
import wechatImg from '/images/footer/wechatImg.png'
import giteeImg from '/images/footer/giteeImg.png'
import globalConfig from '@/config/index'
import { computed, onMounted } from 'vue'
import { getParamsDetail } from '_r/home'

let webSiteName = '网站名称XXX'
let copyrightYear = computed(() => new Date().getFullYear())
let licenseNo = '备案号XXX'

const joinList = [
	{
		class: 'qq',
		logo: 'icon-qq',
		img: qqImg,
		title: 'QQ群'
	},
	{
		class: 'wechat',
		logo: 'icon-weixin-copy',
		img: wechatImg,
		title: '微信公众号'
	},
	{
		class: 'gitee',
		logo: 'icon-mayun',
		img: giteeImg,
		title: '码云 开源社区'
	}
]

onMounted(() => {
	getParamsDetailData()
})

const getParamsDetailData = () => {
	getParamsDetail({ groupName: 'copyright' }).then((res) => {
		if (res.success) {
			licenseNo = res.data.licenseKey || '备案号XXX'
			webSiteName = res.data.domainChineseName || '网站名称XXX'
		}
	})
}
</script>

<style lang="scss" scoped>
@import '_a/styles/element-plus-varibles.scss';

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
			@media screen and (max-width: 920px) {
				width: 160px;
			}
		}
		.split {
			margin: 0 8px;
		}
		.link {
			color: #fff;
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
			list-style: none;
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
