import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token:""
	},
	mutations: {
		successSubscribeMutation(state) {
			return state.successSubscribe = !state.successSubscribe ? true : false;
		}},
	actions: {
		
	},
	modules: {},
});
