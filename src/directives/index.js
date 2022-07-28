// import Vue from 'vue'
// 当图片的地址错误时 显示默认图片
// Vue.directive('imagerror', { // 当我们想封装一个dom操作的时候，就可以使用自定义指令
// 指令绑定的dom元素插入到dom树中执行
// inserted (el) {
//   el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
// },
// 数据更新执行
//   update (el) {
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })

export const imagerror = {
  inserted (el) {
    el.onerror = function () {
      // el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
      el.src = '@/assets/common/bigUserHeader.png'
    }
  }
}
