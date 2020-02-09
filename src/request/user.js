/**
 * post请求，formData格式，不传额外info参数,调用接口时，test({key: value}).then(res => {})
 * export const test = p => post('/user/getattentionstate', p);
 * 
 * post请求，非formData格式，传递额外info = true参数，调用接口时，test({key: value},true).then(res => {})
 * export const test = (p, info) => post('/user/getattentionstate', p, info);
 * 
 * 目前所有post接口均采用formData格式
 */

//  和用户信息相关的接口
import { get,post } from './http'

/* 用户登录 */
export const login = p => post('/user/userlogin', p); //登录 
export const checkUserLoginInfo = p => get('/user/checkuserlogininfo', p); //登录状态及个人信息
export const logout = p => post('/user/userlogout', p); //退出登录
export const getAttentionCountByUserId = p => get('/user/getattentioncountbyuserid', p); //获取关注用户数量
export const getAttentionListByUserId = p => get('/user/getattentionlistbyuserid', p); //获取关注用户列表
export const getFansListByUserId = p => get('/user/getfanslistbyuserid', p); //获取关注粉丝列表
export const getUserInfoById = p => get('/user/getuserinfobyid', p); //获取用户信息
export const authorize = p => post('/user/authorize/qq', p); //qq登录接口

/* 用户注册 */
export const addUser = p => post('/user/adduser', p); //注册 
export const sendVerCode = p => post('/user/sendverificationcode', p); //发送验证码