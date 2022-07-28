import PageTool from './pageTool'
import UploadImage from './UploadImage'
// Vue 插件的写法
// 1.定义一个插件，插件就是一个普通的对象，只不过这个对象有一个固定的方法叫install,参数就是Vue
// 2.使用一个插件 Vue.use(插件名字)，使用的时候就会自动执行install方法
// 为什么使用插件
// 简化代码，使用插件的写法，不管我们定义了多少个全局组件，在main.js里都只需要写一行代码
// 常用的插件：element-ui, vuex,VueRouter  使用Vue.use()的都是插件
export default {
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
  }
}
