import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token: false,
		userId: null,
		user: [],
		allPosts:[]
	},
	mutations: {
		ISCONNECT(state) {
			return (state.isConnect = !state.isConnect ? true : false);
		},
		SUCCESSSUBSCIBE(state) {
			return (state.successSubscribe = !state.successSubscribe ? true : false);
		},
		TOKEN(state, tokenRequest) {
			return state.token = tokenRequest;
		},
		USERID(state, userIdRequest) {
			return state.userId = userIdRequest;
		},
		USER(state, userDataRequest) {
			return state.user = userDataRequest;
		},
		ALLPOSTS(state, allPostsDataRequest) {
			return state.allPosts = allPostsDataRequest;
		},
	},
	actions: {},
	modules: {},
});
