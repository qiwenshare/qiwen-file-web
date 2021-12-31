<template>
	<!-- 类型 markdown-body 不可更改或删除，markdown 样式均在此类中生效 -->
	<div class="markdown-body" v-html="value"></div>
</template>

<script>
// 代码高亮样式表
import '_public/mavonEditor/css/tomorrow-night.css'
import '_public/mavonEditor/css/github-markdown.css'

export default {
	name: 'MarkdownPreview',
	props: {
		// markdown 转义后的 html 字符串
		value: {
			type: String,
			default: ''
		}
	}
}
</script>
