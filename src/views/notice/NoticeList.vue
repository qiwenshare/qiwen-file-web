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
				v-loading="loading"
				:show-header="false"
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

<script>
import { getNoticeList } from '_r/home.js'

export default {
	name: 'NoticeList',
	data() {
		return {
			loading: false,
			tableData: [],
			pageObj: {
				page: 1,
				pageSize: 10
			},
			total: 0
		}
	},
	mounted() {
		this.getTableData()
	},
	methods: {
		/**
		 * 获取公告列表数据
		 */
		getTableData() {
			this.loading = true
			getNoticeList({
				...this.pageObj
			}).then((res) => {
				if (res.success) {
					if (Array.isArray(res.data)) {
						this.tableData = res.data
						this.total = res.meta.count
					} else {
						this.tableData = res.data.list
						this.total = Number(res.data.total)
					}
					this.$emit('handleGetTableDataSuccess', res.data)
					this.loading = false
				}
			})
		},
		/**
		 * 页码改变时触发
		 * @param {number} page 当前页数
		 */
		handleCurrentChange(page) {
			this.pageObj.page = page
			this.getTableData()
		},
		/**
		 * 表格行点击事件
		 * @param {object} row 当前行数据
		 */
		handleTableRowClick(row) {
			this.$router.push({
				name: 'NoticeDetail',
				params: { noticeId: row.noticeId }
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
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
      text-align: right;
    }
  }
}
</style>
