import axios from "axios"
import router from '@/router/router.js'

// 请求超时时间
axios.defaults.timeout = 10000 * 5;

// 请求基础URL
axios.defaults.baseURL = '/api';

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
  },
  // 服务器状态码不是200的情况 
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          router.replace({ name: 'Error_500' })
          break;
        case 401:
          router.replace({ name: 'Error_401' })
          break;
        case 404:
          router.replace({ name: 'Error_404' })
          break;
        default:
          return Promise.reject(error.response);
      }
    }
  }
);
/** 
* get方法，对应get请求 
*/
export function get(url, params, info = '') {
  return new Promise((resolve, reject) => {
    axios.get(url + info, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * info为 true，formData格式；
 * info为 undefined或false，是json格式
 */
export function post(url, data = {}, info) {
  return new Promise((resolve, reject) => {
    let newData = data
    if (info) {  //  转formData格式
      newData = new FormData();
      for (let i in data) {
        newData.append(i, data[i]);
      }
    }
    axios.post(url, newData)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/**
 * 封装put请求
 */

export function put(url, params = {}, info = "") {
  return new Promise((resolve, reject) => {
    axios.put(url + info, params)
      .then(res => {
        resolve(res.data);
      }, err => {
        reject(err.data)
      })
  })
}

/**
* 封装delete请求
*/
export function axiosDelete(url, params = {}, info = "") {
  return new Promise((resolve, reject) => {
    axios.delete(url + info, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}