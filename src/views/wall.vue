<template>
  <div class="wall">
    <Nav></Nav>
	<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     Inscription reussie!</b-alert>
	<!-- <b-card v-for="item in allPosts" :key="item.id">{{item.post_content}}</b-card> -->
	<div>
  <b-card title="" sub-title="" v-for="item in allPosts" :key="item.id" class="post">
    <b-card-text>
     {{item.post_content}}
    </b-card-text>
<b-nav class="likeComment">
	<div > 
	<b-link><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="25">
	<b-card-text class="jaime" >J'aime</b-card-text>
	</b-link>
	</div>
<div >
	<b-link><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="25">
	<b-card-text class="commenter"  >Commenter</b-card-text>
	</b-link>
</div>
<div>
	<b-link v-if="item.user_id === $store.state.userId || $store.state.isAdmin" ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="25">
	<b-card-text class="commenter"  >supprimer</b-card-text>
	</b-link>
	</div>
	
  </b-nav>
  </b-card>
</div>
	
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';
export default {
	name: 'wall',
	data(){
		return{
			dismissSecs: 5,
			dismissCountDown: 0,
		};
	},
	components: {
		Nav
	},
	computed:{
		allPosts() {
			return this.$store.state.allPostsStore;
		},
		...mapState([
			'successSubscribe',
			'token',
			'isConnect',
			'userId',
			'isAdmin',
			'userStore',
			'allPostsStore']),
	},
	methods:{
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert() {
			this.dismissCountDown = this.dismissSecs;
		},
		successSubscrirtionShow(){
			this.$store.commit('successSubscribeMutation');
		},
	},
	mounted(){
		if (this.$store.state.successSubscribe){
			this.showAlert();
			this.successSubscrirtionShow();
		}
		
	}
};
</script>


<style lang="scss" scoped>

.post {
	margin-top:5rem
}
.likeComment {
	display: flex;
	justify-content: space-around;

}
.commenter, .jaime {
	text-decoration: none;
	color: rgb(115, 20, 20);
}

</style>