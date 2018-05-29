import Vue from 'vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
const fontawesome = () => import(/* webpackChunkName: "other-css" */ './public/css/font-awesome.min.css')
const editorCss = () => import(/* webpackChunkName: "other-css" */ './public/css/medium-editor.css')
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.use(ElementUI)

// 异步加载非核心css
window.onload = function () {
  fontawesome()
  editorCss()
}

const app = new Vue({
  router,
  store,
  ...App
})

app.$mount('#app')
