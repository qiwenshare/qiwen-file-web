<template>
	<!-- 类型 markdown-body 不可更改或删除，markdown 样式均在此类中生效 -->
	<div class="markdown-body" v-html="modelValue"></div>
</template>

<script setup lang="ts">
// 代码高亮样式表
import '_public/mavonEditor/css/tomorrow-night.css'
import '_public/mavonEditor/css/github-markdown.css'

const props = defineProps({
	// markdown 转义后的 html 字符串
	modelValue: {
		type: String,
		default: ''
	}
})
</script>
