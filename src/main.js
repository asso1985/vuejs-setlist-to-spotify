// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss');

// Vue.config.productionTip = false;
// Vue.config.BASE_API_URL = 'http://localhost:3000/';
// Vue.config.BASE_API_URL = 'https://api-setlist-to-spotify.herokuapp.com/';
Vue.config.BASE_API_URL = 'http://api.setlist2spotify.com/';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
