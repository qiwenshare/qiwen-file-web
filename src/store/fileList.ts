import { defineStore } from 'pinia'
import { allColumnList } from '@/libs/map'

export const fileListStore = defineStore('fileListStore', {
	state: () => {
		return {
			// 表格中显示的列
			selectedColumn: localStorage.getItem('qiwen_selected_column_list'),
			// 文件展示模式 0 列表模式 | 1 网格模式 | 2 时间线模式
			model: localStorage.getItem('qiwen_file_model'),
			// 网格模式 & 时间线模式下 图标大小 单位px
			gridSize: localStorage.getItem('qiwen_grid_size')
				? Number(localStorage.getItem('qiwen_grid_size'))
				: 80,
			// 批量模式下：被选中的文件列表
			selectedFiles: [],
			// 是否批量操作：true - 批量，false - 单文件
			isBatchOperation: false
		}
	},
	getters: {
		// 表格显示列
		selectedColumnList: (state) =>
			state.selectedColumn === null
				? allColumnList
				: state.selectedColumn.split(','),
		// 文件查看模式
		fileModel: (state) => (state.model === null ? 0 : Number(state.model)),
		// 网格模式 & 时间线模式下 文件图标大小
		gridSize: (state) => state.gridSize
	},
	actions: {
		/**
		 * 改变表格显示列
		 * @description 表格显示列保存在 pinia 和 cookie 中
		 * @param {[]} data 表格需要显示的列数组
		 */
		changeSelectedColumnList(data: []) {
			localStorage.setItem('qiwen_selected_column_list', data.toString())
			this.selectedColumn = data.toString()
		},
		/**
		 * 改变文件展示模式
		 * @description 文件展示模式保存在 pinia 和 cookie 中
		 * @param {string} data 文件展示模式
		 */
		changeFileModel(data: string) {
			localStorage.setItem('qiwen_file_model', data)
			this.model = data
		},
		/**
		 * 网格模式 & 时间线模式 改变文件图标大小
		 * @description 文件图标大小保存在 pinia 和 cookie 中
		 * @param {string} data 文件图标大小
		 */
		changeGridSize(data: string) {
			localStorage.setItem('qiwen_grid_size', data)
			this.gridSize = Number(data)
		},
		/**
		 * 设置批量操作模式下被选中的文件列表
		 * @param {array} data 批量操作模式下，被选中的文件列表
		 */
		changeSelectedFiles(data: []) {
			this.selectedFiles = data
		},
		/**
		 * 设置是否批量操作
		 * @param {boolean} data 是否批量操作
		 */
		changeIsBatchOperation(data: boolean) {
			this.isBatchOperation = data
		}
	}
})
