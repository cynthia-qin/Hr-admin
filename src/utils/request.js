import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 响应成功
  const { data, success, message } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  // 当code === 10002 表示token失效
  // 根据后端 服务器返回得数据知道token失效 进行处理
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  // 响应失败
  return Promise.reject(error)
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const token = store.state.user.token
  if (token) {
    // 由前端主动判断token是否过期
    const time = Date.now() - getTime() - 0 // 隐式转换
    const maxTime = 2 * 60 * 60 * 1000
    if (time > maxTime) { // 如果超时就直接登出切换到登录页面
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

export default request
