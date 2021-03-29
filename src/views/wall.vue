<template>



	
  <b-col class="wall">
   <Nav></Nav>
	<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     Inscription reussie!</b-alert>
	<!-- <b-card v-for="item in allPosts" :key="item.id"></b-card>  -->
	<div class="wallPosts">
  <b-card title="" sub-title="" v-for="item in allPosts" :key="item.id" class="post">
    <b-card-text>
     {{item.post_content}}
    </b-card-text>
<b-nav class="likeComment">
	<div > 
	<b-link><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="25">
	<b-card-text class="like" >J'aime</b-card-text>
	</b-link>
	</div>
<div >
	<b-link><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="25">
	<b-card-text class="comment"  >Commenter</b-card-text>
	</b-link>
</div>
<div>
	<b-link v-if="item.user_id === $store.state.userId || $store.state.isAdmin" ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="25">
	<b-card-text class="delete"  >supprimer</b-card-text>
	</b-link>
	</div>
	
  </b-nav>
  </b-card>
</div> 
	
  </b-col>
  
 
  

 

 
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
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	components: {
		Nav
	},
	computed:{
		allPosts() {
			return this.$store.state.allPosts;
		},
		...mapState([
			'successSubscribe',
			'token',
			'isConnect',
			'userId',
			'isAdmin',
			'user',
			'allPosts']),
	},
	methods:{
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert() {
			this.dismissCountDown = this.dismissSecs;
		},
		successSubscrirtionShow(){
			this.$store.commit('SUCCESSSUBSCIBE');
		},
		allpostsInStore(allPostsData){
			this.$store.commit('ALLPOSTS',allPostsData);
		},
		async findAllPosts() {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/posts`, requestOptions);
			console.log(response);
			this.allPostsData = await response.json();
			console.log(this.$store.state.user);
			if(this.allPostsData.count !== 0 && this.isConnect){
				return this.allpostsInStore(this.allPostsData.data.rows);
			} 
		
		}
	},
	mounted(){
		this.findAllPosts();
		if (this.$store.state.successSubscribe){
			this.showAlert();
			this.successSubscrirtionShow();
		}
		
	}
};
</script>


<style lang="scss" scoped>
.wall{
	margin-top: 4rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.post {
	margin-top:1rem;
	
	
	
	
}
.likeComment {
	display: flex;
	justify-content: space-around;

}
.comment, .like, .delete {
	text-decoration: none;
	color: rgb(115, 20, 20);
}

</style>