// 导入自己需要的组件
import {
	Dialog,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	Menu,
	Submenu,
	MenuItem,
	MenuItemGroup,
	Input,
	InputNumber,
	Radio,
	RadioGroup,
	RadioButton,
	Select,
	Option,
	OptionGroup,
	Button,
	ButtonGroup,
	Table,
	TableColumn,
	Tooltip,
	Form,
	FormItem,
	Icon,
	Upload,
	Image,
	Backtop,
	MessageBox,
	Message,
	Notification,
	Avatar,
	Container,
	Header,
	Aside,
	Main,
	Footer,
	Breadcrumb,
	BreadcrumbItem,
	Loading,
	Timeline,
	TimelineItem,
	Alert,
	Tree,
	Progress,
	Slider,
	Divider,
	Pagination,
	CheckboxGroup,
	Checkbox,
	Popover,
	Carousel,
	CarouselItem,
	DatePicker,
	Drawer
} from 'element-ui'

const element = {
	install: function (Vue) {
		Vue.use(Dialog)
		Vue.use(Dropdown)
		Vue.use(DropdownMenu)
		Vue.use(DropdownItem)
		Vue.use(Menu)
		Vue.use(Submenu)
		Vue.use(MenuItem)
		Vue.use(MenuItemGroup)
		Vue.use(Input)
		Vue.use(InputNumber)
		Vue.use(Radio)
		Vue.use(RadioGroup)
		Vue.use(RadioButton)
		Vue.use(Select)
		Vue.use(Option)
		Vue.use(OptionGroup)
		Vue.use(Button)
		Vue.use(ButtonGroup)
		Vue.use(Table)
		Vue.use(TableColumn)
		Vue.use(Tooltip)
		Vue.use(Form)
		Vue.use(FormItem)
		Vue.use(Icon)
		Vue.use(Upload)
		Vue.use(Image)
		Vue.use(Backtop)
		Vue.use(Avatar)
		Vue.use(Container)
		Vue.use(Header)
		Vue.use(Aside)
		Vue.use(Main)
		Vue.use(Footer)
		Vue.use(Breadcrumb)
		Vue.use(BreadcrumbItem)
		Vue.use(Loading.directive)
		Vue.use(Timeline)
		Vue.use(TimelineItem)
		Vue.use(Alert)
		Vue.use(Tree)
		Vue.use(Progress)
		Vue.use(Slider)
		Vue.use(Divider)
		Vue.use(Pagination)
		Vue.use(CheckboxGroup)
		Vue.use(Checkbox)
		Vue.use(Popover)
		Vue.use(Carousel)
		Vue.use(CarouselItem)
		Vue.use(DatePicker)
		Vue.use(Drawer)
		Vue.prototype.$loading = Loading.service
		Vue.prototype.$msgbox = MessageBox
		Vue.prototype.$alert = MessageBox.alert
		Vue.prototype.$confirm = MessageBox.confirm
		Vue.prototype.$prompt = MessageBox.prompt
		Vue.prototype.$notify = Notification
		Vue.prototype.$message = Message
	}
}
export default element
