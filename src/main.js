import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import './plugins/bootstrap-vue';
import App from './App.vue';
import router from './router';
import store from './store';

import moment from "moment";
import VueMoment from "vue-moment";

// Load Locales ('en' comes loaded by default)
require("moment/locale/fr");

// Choose Locale
moment.locale("fr");

Vue.use(VueMoment, { moment });

import Vuelidate from "vuelidate";
Vue.use(Vuelidate);



Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
