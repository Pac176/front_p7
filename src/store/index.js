import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import dotenv from "dotenv";
dotenv.config();

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		wallUserId:null,
		urlApi:process.env.VUE_APP_URL_API,
		isConnect: false,
		isAdmin: false,
		successSubscribe: false,
		token: null,
		userId: null,
		user: null,
		allUsers: [],
		allPosts: [],
		allComments:[],
		allPostsByUserId: [],
		deleteAccountRequest: {},
		deleteAccountSuccess: false,
	},
	mutations: {
		ISCONNECT(state) {
			return (state.isConnect = !state.isConnect ? true : false);
		},
		SUCCESSSUBSCRIBE(state, response) {
			return (state.successSubscribe = response);
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
		ALLUSERS(state, allUsersDataRequest) {
			return (state.allUsers = allUsersDataRequest);
		},
		ALLCOMMENTS(state, allCommentsDataRequest) {
			return (state.allComments = allCommentsDataRequest);
		},
		DELETEACCOUNT(state, deleteRequest) {
			return (state.deleteAccountRequest = deleteRequest);
		},
		DELETESUCCESS(state) {
			return (state.deleteAccountSuccess = !state.deleteAccountSuccess
				? true
				: false);
		},
		WALLUSERID(state, wallUserdata) {
			return (state.wallUserId = wallUserdata);
		}
	},
	actions: {},
	modules: {},
	plugins: [createPersistedState()],
});
