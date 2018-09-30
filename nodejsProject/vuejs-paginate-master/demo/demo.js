import Vue from 'vue'
import Paginate from '../../node_modules/vuejs-paginate'
import App from './App'

Vue.component('paginate', Paginate)

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
