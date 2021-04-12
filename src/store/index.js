import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token: null,
		userId: null,
		user: null,
		allUsers: [],
		allPosts: [],
		allPostsByUserId: [],
		allComments: [],
		deleteAccountRequest: {},
		deleteAccountSuccess: false,
	},
	mutations: {
		ISCONNECT(state) {
			return (state.isConnect = !state.isConnect ? true : false);
		},
		SUCCESSSUBSCIBE(state) {
			return (state.successSubscribe = !state.successSubscribe ? true : false);
		},
		TOKEN(state, tokenRequest) {
			state.token = tokenRequest;
		},
		USERID(state, userIdRequest) {
			return (state.userId = userIdRequest);
		},
		USER(state, userDataRequest) {
			return (state.user = userDataRequest);
		},
		ALLPOSTS(state, allPostsDataRequest) {
			return (state.allPosts = allPostsDataRequest);
		},
		ALLPOSTSBYUSERID(state, allPostsByUserIdDataRequest) {
			return (state.allPostsByUserId = allPostsByUserIdDataRequest);
		},
		ALLCOMMENTS(state, allCommentsDataRequest) {
			return (state.allComments = allCommentsDataRequest);
		},
		ALLUSERS(state, allUsersDataRequest) {
			return (state.allUsers = allUsersDataRequest);
		},
		DELETEACCOUNT(state, deleteRequest) {
			return (state.deleteAccountRequest = deleteRequest);
		},
		DELETESUCCESS(state) {
			return (state.deleteAccountSuccess = !state.deleteAccountSuccess
				? true
				: false);
		},
	},
	actions: {},
	modules: {},
	plugins: [createPersistedState()],
});
