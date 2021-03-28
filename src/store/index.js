import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
	
	state: {
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token: null,
		userId: null,
		user: null,
		allPosts: [],
	},
	mutations: {
		ISCONNECT(state) {
			state.isConnect = !state.isConnect ? true : false;
			return localStorage.setItem("isConnect", state.isConnect);
		},
		SUCCESSSUBSCIBE(state) {
			return (state.successSubscribe = !state.successSubscribe ? true : false);
		},
		TOKEN(state, tokenRequest) {
			state.token = tokenRequest;
			return localStorage.setItem('token', state.token);
		},
		USERID(state, userIdRequest) {
			return (state.userId = userIdRequest);
		},
		USER(state, userDataRequest) {
			return (state.user = userDataRequest);
		},
		ALLPOSTS(state, allPostsDataRequest) {
			state.allPosts = allPostsDataRequest;
			return localStorage.setItem("allPosts", state.allPosts);
		},
	},
	actions: {},
	modules: {},
});
