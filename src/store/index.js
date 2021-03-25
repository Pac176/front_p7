import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token: false,
		userId:null
	},
	mutations: {
		isConnectMutation(state) {
			return (state.isConnect = !state.isConnect ? true : false);
		},
		successSubscribeMutation(state) {
			return state.successSubscribe = !state.successSubscribe ? true : false;
		},
		tokenSet(state, tokenRequest) {
			return state.token = tokenRequest;
		},
		userIdSet(state, userIdRequest) {
			return state.userId = userIdRequest;
		}
	},
	actions: {
		
	},
	modules: {},
});
