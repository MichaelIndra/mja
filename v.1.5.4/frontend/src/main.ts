import currency from 'v-currency-field';
import 'v-currency-field/dist/index.css';
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(currency);
Component.registerHooks(['validations']);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
