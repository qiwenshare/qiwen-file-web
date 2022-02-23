// 用户信息相关接口
import { get, post } from './http'

// 用户登录
export const login = (p?: any) => get('/user/login', p)
// 获取登录状态及用户信息
export const checkUserLoginInfo = (p?: any) =>
	get('/user/checkuserlogininfo', p)
// 用户注册
export const addUser = (p?: any) => post('/user/register', p)
