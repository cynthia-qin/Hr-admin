import router from '@/router'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '/404'] // 定义白名单
// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 进度条
  nProgress.start()
  const token = store.state.user.token
  if (token) {
    // token存在 已经登录
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        // 请求用户资料 这样这块就只会请求一次，不会每次切换路由都请求
        store.dispatch('user/getInfo')
      }
      next() // 放行
    }
  } else {
    // token不存在 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()
})

// 后置路由守卫
router.afterEach(() => {
  nProgress.done()
})
