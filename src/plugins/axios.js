"use strict";

import axios from "axios";
import service from '../request/api';

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: '/', //基础URL，在vue.config.js中配置过跨域，因此用 /api
  timeout: 1000 *60 * 30  //超时时长
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

// 请求格式和参数的统一
const http = {}; //存放响应值

for(let key in service) { //循环遍历api.js中的每个接口，获取method,url,params等
  let api = service[key]; //获取method,url
  http[key] = async function(
    params, //请求参数
    isFormData = false, //是否是formdata格式
    config = {} //配置参数
  ) {
    let newParams = {};
    if(params && isFormData) { //是formdata
      newParams = new FormData();
      for(let i in params) {
        newParams.append(i,params[i]);
      }
    } else { //不是formdata
      newParams = params;
    }
    
    //不同请求的判断
    let response = {}; // 请求的返回值
    if (api.method === 'put' || api.method === 'post' || api.method === 'petch') {
      try{
        response = await _axios[api.method](api.url,newParams,config)
      } catch(err) {
        response = err;
      }
    } else if(api.method === 'delete') {
      try {
        response = await _axios[api.method](api.url, config)
      } catch (err) {
        response = err;
      }
    } else { //get请求
      config.params = newParams;
      try {
        response = await _axios[api.method](api.url, config)
      } catch (err) {
        response = err;
      }
    }
    return response; //返回响应值
  }
}

// 拦截器
_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    console.log("请求出错");
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    console.log("响应出错");
    return Promise.reject(error);
  }
);

export default http

/*
Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin; */
