import Vue from 'vue'
import App from './App'
import store from './store'

import http from './utils/http_weixin'
Vue.prototype.$http = http

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
