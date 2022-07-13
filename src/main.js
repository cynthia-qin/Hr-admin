import Vue from 'vue'
// 设置浏览器样式 使不同浏览器渲染同一标签的效果一致
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 国际化 多语言 是个语言包
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon svg图标
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale }) // 国际化
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
// 控制台生产环境提示 false 表示禁用提示
Vue.config.productionTip = false

new Vue({
  el: '#app', // 根节点
  router,
  store,
  render: h => h(App) // 渲染的内容放在App里
})
