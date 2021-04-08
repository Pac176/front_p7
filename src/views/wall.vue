<template>

<div>
 <Nav></Nav><br>
 <b-row class="wall">
	<b-col md="3" sm>
		<h4>{{user.first_name}} {{user.last_name}}</h4>
	</b-col>
	<b-col  md="6" sm>
		<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
			Inscription reussie!</b-alert>
		<b-link v-b-modal.publication style='text-decoration:none'>
		<b-button  block variant="outline-secondary" class='postInput'  style=' color:rgb(217, 120, 80 )' >{{textArea}}</b-button>
		</b-link>
<!-- modal publication -->
		<b-modal id="publication" hide-footer size="lg">
			<template #modal-title>
			Creer une Publication
			</template>
			<div class="d-block text-center">
				<div>
					<b-form-textarea v-model='textArea' autofocus id="textarea" style='border: none;  -webkit-box-shadow: none;' placeholder=""  rows="1"	max-rows="10">

					</b-form-textarea>
					<pre class="mt-3 mb-0"></pre>
				</div>
			</div>
			<b-button class="mt-5" variant='outline-primary' block @click="createPost">Publier</b-button>
		</b-modal>
<!-- publications -->
	<b-card title="" sub-title="" v-for="item in allPosts" :key="item.id" class="post">
		<b-button class="rounded-circle"  variant="outline-secondary"></b-button><b-img src="https://picsum.photos/1024/400/?image=41" fluid alt="Responsive image" class="rounded-circle authorImg"></b-img>
		<span class="authorPost">{{authorFind(item).pseudo}}</span><br>
		<span class="datePost">{{item.createdAt}}</span>
			<b-card-text class='textPost'>
				{{item.post_content}}
			</b-card-text>
		<b-row class="likeComment" >
			<b-col>
				<b-button block variant="outline-secondary" class='btnLikeComment'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="15">
				<b-card-text class="like" >J'aime</b-card-text>
				</b-button>
			</b-col>
			<b-col>
				<b-button   block variant="outline-secondary" class='btnLikeComment'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="15">
				<b-card-text class="comment"  >Commenter</b-card-text>
				</b-button>
			</b-col>
			<b-col v-if="item.user_id === $store.state.userId || $store.state.isAdmin">
				<b-button  block variant="outline-secondary"  class='btnLikeComment' ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="15">
				<b-card-text class="delete"  >Supprimer</b-card-text>
			</b-button>
			</b-col>
		</b-row>
	</b-card>
	</b-col>
	<b-col  md= '3' sm>
	<div>menudroit</div>
	</b-col>
</b-row>	
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
			author:"",
			textArea: this.textAreaDefine(),
			first_name:this.$store.state.user.first_name,
			last_name:this.$store.state.user.last_name,
			pseudo: this.$store.state.user.pseudo,
			password:null,
			email:this.$store.state.user.email,
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
			'allUsers',
			'allPosts']),
	},
	methods:{
		authorFind(item){
			return this.author = this.allUsers.find(user => user.id === item.user_id);
		},
		textAreaDefine(){
			return this.textarea = "Quoi de neuf?" + this.$store.state.user.first_name + "......";
		},
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
		allUsersInStore(allUsersData){
			this.$store.commit('ALLUSERS',allUsersData);
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
		
		},
		async findAllUsers() {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/users`, requestOptions);
			console.log(response);
			this.allUsersData = await response.json();
			console.log(this.$store.state.user);
			if(this.allUsersData.count !== 0 && this.isConnect){
				return this.allUsersInStore(this.allUsersData.data.rows);
			} 
		
		},
		async createPost(){
			this.$bvModal.hide('publication');
			console.log(this.textArea);
			const requestOptions = {
				
				method: "Post",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					post:{ 
						post_content : this.textArea,
						user_id : this.userId
					}
				})
			};
			await fetch(this.urlApi + `/posts`, requestOptions);
			
			
			
			
		},
		async deletePost(){
			this.$bvModal.hide('publication');
			console.log(this.textArea);
			const requestOptions = {
				
				method: "Post",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					post:{ 
						post_content : this.textArea,
						user_id : this.userId
					}
				})
			};
			await fetch(this.urlApi + `/posts`, requestOptions);
			
			
			
			
		}
	},
	mounted(){
	
		this.findAllPosts();
		this.findAllUsers();
		if (this.$store.state.successSubscribe){
			this.showAlert();
			this.successSubscrirtionShow();
		}
		
	}
};
</script>


<style lang="scss" scoped>
.col{
	padding:0;
	width:70%;
}
.card{
	width:100%;
	padding:1rem
}
.wall{
	margin-top: 5rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
.buttonAuthorImg{
	
}
.authorImg{
	
	
} 
.post {
	margin-top:1rem;
	
.textPost{
	text-align: justify;
}	
.btnLikeComment{
	padding:0;
	border:none
}
	
}
.likeComment {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	width:100%;
	margin:0

}
.comment, .like, .delete {
	text-decoration: none;
	color: rgb(115, 20, 20);
}
.postInput{
	overflow:hidden;
	margin:0rem;
	border-radius: 20px;
	height:3rem;
	align-items: center;
	display: flex;
	align-items: center;
	text-decoration:none;
	color:black
}
.card-body{
	padding:0;
	
	
}

</style>