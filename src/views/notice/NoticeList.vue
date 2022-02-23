<template>
	<div class="notice-list-wrapper">
		<div class="notice-list-inner">
			<!-- 导航栏 -->
			<el-breadcrumb
				class="notice-breadcrumb"
				separator-class="el-icon-arrow-right"
			>
				<el-breadcrumb-item :to="{ name: 'Home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>平台公告</el-breadcrumb-item>
			</el-breadcrumb>
			<!-- 公告列表 -->
			<el-table
				class="notice-list"
				:data="tableData"
				:show-header="false"
				v-loading="loading"
				size="medium"
				@row-click="handleTableRowClick"
			>
				<el-table-column label="公告标题" prop="title"></el-table-column>
				<el-table-column
					label="创建时间"
					prop="createTime"
					width="160"
					align="center"
				></el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination
				layout="total, prev, pager, next, jumper"
				:current-page.sync="pageObj.page"
				:page-size.sync="pageObj.pageSize"
				:total="total"
				:pager-count="5"
				@current-change="handleCurrentChange"
			>
			</el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getNoticeList } from '_r/home'

const router = useRouter()

let loading = ref(false)
let tableData = ref<any[]>([])
let pageObj = reactive({
	page: 1,
	pageSize: 10
})
let total = ref(0)

/**
 * 获取公告列表数据
 */
const getTableData = () => {
	loading.value = true
	getNoticeList({
		...pageObj
	}).then((res) => {
		if (res.success) {
			tableData.value = res.data.list
			total.value = res.data.total
			loading.value = false
		}
	})
}
onMounted(() => {
	getTableData()
})
/**
 * 页码改变时触发
 * @param {number} page 当前页数
 */
const handleCurrentChange = (page: number) => {
	pageObj.page = page
	getTableData()
}
/**
 * 表格行点击事件
 * @param {object} row 当前行数据
 */
const handleTableRowClick = (row: any) => {
	router.push({
		name: 'NoticeDetail',
		params: { noticeId: row.noticeId }
	})
}
</script>

<style lang="scss" scoped>
.notice-list-wrapper {
	display: block !important;
	padding: 16px 0;
	.notice-list-inner {
		margin: 0 auto;
		max-width: 1200px;
		.notice-breadcrumb {
			margin-bottom: 16px;
		}
		.notice-list {
			cursor: pointer;
		}
		.el-pagination {
			margin-top: 16px;
			justify-content: right;
		}
	}
}
</style>
