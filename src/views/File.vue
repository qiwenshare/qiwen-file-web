<template>
	<div class="file-wrapper">
		<el-container class="el-container">
			<el-aside width="auto">
				<AsideMenu></AsideMenu>
			</el-aside>
			<el-container>
				<el-main class="el-main">
					<FileList></FileList>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import AsideMenu from '_c/file/AsideMenu.vue'
import FileList from '_c/file/FileList.vue'

export default {
	name: 'File',
	components: {
		AsideMenu,
		FileList
	}
}
</script>

<style lang="stylus" scoped>
@import '~_a/styles/varibles.styl';
@import '~_a/styles/mixins.styl';

.file-wrapper {
  width: 100% !important;
}

.el-container {
  .el-aside {
    height: calc(100vh - 61px);
    overflow: hidden;
  }
}

.el-main {
  padding: 0px 16px !important;
  overflow: hidden;
}
</style>
