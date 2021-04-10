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
		<b-link v-b-modal.publication @click='resetModal' style='text-decoration:none'>
		</b-link>
		<h2>Fil d'actualité de {{allPostsByUserId[0].user.pseudo}}</h2>
		<div>Inscrit le {{momentDateMouse(allPostsByUserId[0].user.createdAt)}}</div>
	<div>Dernière connexion {{momentDateMouse(allPostsByUserId[0].user.updatedAt)}}</div><br>
		<b-link  block variant="outline-secondary" class='postInput'  style='color:rgb(217, 120, 80 )' >{{textArea}}</b-link>
<!-- modal publication -->
		<b-modal id="publication" hide-footer size="lg" @close='alertCloseModal'>
			<template #modal-title >
			Creer une Publication
			</template>
			<div class="d-block text-center">
				<div>
					<b-form-textarea v-model='textArea' autofocus id="textarea" style='border: none;  -webkit-box-shadow: none;' placeholder=""  rows="1"	max-rows="10">

					</b-form-textarea>
					<pre class="mt-3 mb-0"></pre>
				</div>
			</div>
			<b-button v-if='textArea !== ""' class="mt-5" variant='outline-primary' block @click="createPost">Publier</b-button>
		</b-modal>
<!-- publications -->
	<b-card title="" sub-title="" v-for="item in allPostsByUserId" :key="item.id" class="post">
		<div class='headerCard'  >
			<b-img   src="https://picsum.photos/50" fluid alt="Responsive image" class="authorImg"></b-img>
				<div class='textHeader' >
					<span   class="authorPost">{{item.user.pseudo}}</span>
					<span v-b-tooltip.bottom.v-secondary ="momentDateMouse(item.createdAt)" >{{ momentDate(item.createdAt)}}</span>
					</div>
		</div>
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
				<b-button  @click='deletePost(item.id)' block variant="outline-secondary"  class='btnLikeComment' ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="15">
				<b-card-text class="delete"   >Supprimer</b-card-text>
			</b-button>
			</b-col>
		</b-row> 
	</b-card>
	</b-col>
	<b-col  md= '3' sm>
	<div></div>
	</b-col>
</b-row>	
</div>
</template>

<script>

// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';
import moment from "moment";
export default {
	name: 'wall',
	data(){
		return{
			textArea: "Quoi de neuf?" + this.$store.state.user.first_name + "......",
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
		allPostsByUserId() {
			return this.$store.state.allPostsByUserId;
		},
		...mapState([
			'successSubscribe',
			'token',
			'isConnect',
			'userId',
			'isAdmin',
			'user',
			'allUsers',
			'allPosts',
			'allPostsByUserId']),
	},
	methods:{
		momentDateMouse(item){
			return moment(item).format('LLL');
		
		},
		momentDate(item){
			
			return moment(item).fromNow();
		},
		async alertCloseModal(bvModalEvent){
			const response =confirm('Etes vous sur de quitter la publication?');
			if(response){
				this.textArea = "Quoi de neuf?" + this.$store.state.user.first_name + "......";
			} else { 
				bvModalEvent.preventDefault ();}
		},
		resetModal(){
			return this.textArea = '';
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
		allPostsByUserIdInStore(allPostsByUserIdData){
			this.$store.commit('ALLPOSTSBYUSERID',allPostsByUserIdData);
		},
		allUsersInStore(allUsersData){
			this.$store.commit('ALLUSERS',allUsersData);
		},
		/* async findAllPosts() {
			console.log('gege');
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
		
		}, */
		async findAllPostsByUserId(userId) {
			
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/posts/users/${userId}`, requestOptions);
			console.log(response);
			this.allPostsByUserIdData = await response.json();
			console.log(this.$store.state.user);
			if(this.allPostsByUserIdData.count !== 0 && this.isConnect){
				return this.allPostsByUserIdInStore(this.allPostsByUserIdData.data.rows);
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
			await this.findAllPosts();
			this.textArea= "Quoi de neuf?" + this.$store.state.user.first_name + "......";
			
			
			
		},
		async deletePost(post){
			//this.$bvModal.hide('publication');
			//console.log(this.textArea);
			const requestOptions = {
				method: "Delete",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				
			};
			await fetch(this.urlApi + `/posts/${post}`, requestOptions);
			confirm('etes vous sur de vouloir supprimer ce post?');
			this.findAllPosts();
			
			
			
		}
	},
	mounted(){
		
		
		
		
	}
};
</script>


<style lang="scss" scoped>
.headerCard{
	font-size: 0.8rem;
	display:flex;
	flex-direction: rows;
	margin-bottom: 1rem;

}
.textHeader{
	display: flex;
	flex-direction: column;
	text-align: left;
	margin-left:0.5rem;
}
.authorImg{
	border-radius: 50%;
}
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
	border:1px rgb(224, 201, 201) solid
}
.card-body{
	padding:0;
	
	
}
.link{
	text-decoration: none;
	color:black
}

</style>