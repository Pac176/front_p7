<template>

<div>
 <Nav></Nav><br>
 <b-row class="wall">
	<b-col md="3" sm>
		<h4>{{user.first_name}} {{user.last_name}}</h4>
		<h6> ({{user.pseudo}})</h6>
		<div>Inscrit le {{momentDateMouse(user.createdAt)}}</div>
		<!-- <div>Dernière connexion {{momentDate(user.updatedAt)}}</div> --><br>
	</b-col>
	<b-col  md="6" sm>
		<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
			Inscription reussie!</b-alert>
		<b-link v-b-modal.publication @click='resetModal' class="link">
		<h2>Fil d'actualité</h2><br>
		<b-link  block variant="outline-secondary" class='postInput'  style='color:rgb(217, 120, 80 )' >{{textArea}}</b-link>
		</b-link>
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
		<b-modal id="updatePublication" hide-footer size="lg" @close='alertCloseModal'>
			<template #modal-title >
			Modifier ma publication
			</template>
			<div class="d-block text-center">
				<div>
					<b-form-textarea  v-model='postToUpdate.post_content' autofocus id="updateTextarea" style='border: none;  -webkit-box-shadow: none;'   rows="1"	max-rows="10">

					</b-form-textarea>
					<pre class="mt-3 mb-0"></pre>
				</div>
			</div>
			<b-button  class="mt-5" variant='outline-primary' block @click="updatePost">Modifier</b-button>
		</b-modal>
<!-- publications -->
	<b-card title="" sub-title="" v-for="(item,index) in allPosts" :key="item.id" class="post">
		<div class='headerCard'>
		<div  class='headerCard'>
			<b-link to="/wall/user" @click='findAllPostsByUserId(item.user.id);'><b-img   src="https://picsum.photos/50" fluid alt="Responsive image" class="authorImg link"></b-img></b-link>
				<div class='textHeader' >
					<b-link to="wall/user" @click='findAllPostsByUserId(item.user.id);' class="authorPost link">{{ item.user.pseudo}}</b-link>
					<b-link class="link" v-b-tooltip.leftbottom.v-info ="momentDateMouse(item.createdAt)" >{{ momentDate(item.createdAt)}}</b-link>
				</div>
		</div>
		<div class="menuHeader">...</div>
		
		</div>
	
			<b-link v-if="item.user_id === $store.state.userId" class="link" v-b-modal.updatePublication @click='findOnePost(item.id)' ><b-card-text v-b-tooltip.right.hover.v-primary title="Modifier" class='textPost linkUser'>{{item.post_content}}</b-card-text></b-link>
			<b-card-text v-else class='textPost '>{{item.post_content}}</b-card-text><br>
		<b-row class="likeComment" >
			<b-col>
				<b-button block variant="outline-secondary" class='btnLikeComment'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="15">
				<b-card-text class="like" v-on:click='createComment(item.id, user.id)'>J'aime</b-card-text>
				</b-button>
			</b-col>
			<b-col>
				<b-button   @click="setFocus( index )" block variant="outline-secondary" class='btnLikeComment'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="15">
				<b-card-text class="comment" >Commenter</b-card-text>
				</b-button>
			</b-col>
			<b-col v-if="item.user_id === userId || user.is_admin === 1">
				<b-button  @click='deletePost(item.id)' block variant="outline-secondary"  class='btnLikeComment' ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="15">
				<b-card-text class="delete" >Supprimer </b-card-text>
			</b-button>
			</b-col>
		</b-row><br>  
		<div v-for="(comment) in allPosts[index].tblComments" :key="comment.id" class='commentAndAction'>
		<b-card class="commentCard">

	<div >
	<b-link href="#" class="link" style='font-size:0.7rem'>{{comment.user.pseudo}}</b-link>
	<b-link v-if="comment.user_id === $store.state.userId" class="link linkUser" ><b-card-text   class='textPost'>{{ comment.comment_content }}</b-card-text></b-link>
    <b-card-text v-else class='textComment'>
     {{comment.comment_content}}
    </b-card-text>
	</div>

  
  </b-card>
	<div v-if="item.user_id === userId || user.is_admin === 1"  block variant="outline-secondary"  class='link actionsComment' style='font-size:0.6rem'>
	<b-link class='link updateComment'  @click='findOneComment(comment.id,index)'>Modifier</b-link>
	<b-link class='link deleteComment' @click='deleteComment(comment.id)' >Supprimer</b-link>
</div></div>
		<b-form-group  v-if='commentToUpdate !== ""'>
			<b-input   :data-key="index" class="inputComment"  v-model='commentToUpdate.comment_content' v-on:keyup.enter="updateComment(item.id,user.id,index)"></b-input>
		</b-form-group>
		<b-form-group  v-else>
			<b-input   :data-key="index" class="inputComment"  v-model='commentToUpdate.comment_content' v-on:keyup.enter="createComment(item.id,user.id,index)"></b-input>
		</b-form-group>


		
			
	</b-card>
	</b-col>
	<b-col  md= '3' sm>
	
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
			postToUpdate:{},
			commentToUpdate:{},
			//comment:[],
			allComments:[],
			startComment:-1, //false, //0,
			dropdownDisplay :'display:none',
			textArea: "Quoi de neuf?" + this.$store.state.user.first_name + "......",
			//first_name:this.$store.state.user.first_name,
			//last_name:this.$store.state.user.last_name,
			//pseudo: this.$store.state.user.pseudo,
			password:null,
			//email:this.$store.state.user.email,
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
		setFocus(index) {
			console.log(index);
			const inputs = document.querySelectorAll('.inputComment');
			console.log(inputs);
			inputs.forEach(ele => { 
				
				if (ele.dataset.key == index) {
					ele.focus();
				} 
			});
		},
   

		/* startCommentOn(postIndex){
			if(postIndex !== this.startComment && postIndex !== -1){
				this.startComment = postIndex;
			} else if (postIndex === -1) {
				console.log(this.comment);
				this.startComment = postIndex;
			}else if(postIndex === this.startComment) {
				this.startComment = -1;
			}

			
		}, */
		DisplayOn(){
			return this.dropdownDisplay = this.dropdownDisplay ==='display:none'? 'display:block' : 'display:none';
		},
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
		allPostsInStore(allPostsData){
			this.$store.commit('ALLPOSTS',allPostsData);
		},
		allPostsByUserIdInStore(allPostsByUserIdData){
			this.$store.commit('ALLPOSTSBYUSERID',allPostsByUserIdData);
		},
		allUsersInStore(allUsersData){
			this.$store.commit('ALLUSERS',allUsersData);
		},
		async findAllPosts() {
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
			if(this.allPostsData.count !== 0 && this.isConnect){
				return this.allPostsInStore(this.allPostsData.data.rows);
			} else{
				this.allPostsInStore('');
			}
		
		},
		async findOnePost(postId) {
			
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/posts/${postId}`, requestOptions);
			this.onePostData = await response.json();
			this.postToUpdate = this.onePostData.data;
		
			
		},
		async findOneComment(commentId,index) {
			
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/comments/${commentId}`, requestOptions);
			this.oneCommentData = await response.json();
			
			this.commentToUpdate = this.oneCommentData.data;
			
			this.setFocus(index);
			
	
		
			
		},
		async findAllPostsByUserId(userId) {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/posts/users/${userId}`, requestOptions);
			this.allPostsByUserIdData = await response.json();
			if(this.allPostsByUserIdData.count !== 0 && this.isConnect){
				this.allPostsByUserIdInStore(this.allPostsByUserIdData.data.rows);
			} else{
				this.allPostsByUserIdInStore('');
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
		async updatePost(){
			this.$bvModal.hide('updatePublication');
			console.log(this.postToUpdate);
			const requestOptions = {
				method: "Put",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					post:{ 
						post_content: this.postToUpdate.post_content,
						userId: 2
					}
				})
			};
			await fetch(this.urlApi + `/posts/${this.postToUpdate.id}`, requestOptions);
			await this.findAllPosts();
			
		
			
			
		},
		async updateComment(){
			this.$bvModal.hide('updatePublication');
			console.log(this.commentToUpdate);
			const requestOptions = {
				method: "Put",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					comment:{ 
						comment_content: this.commentToUpdate.comment_content,
						userId:this.commentToUpdate.user_id
					}
				})
			};
			await fetch(this.urlApi + `/comments/${this.commentToUpdate.id}`, requestOptions);
			await this.findAllPosts();
			this.commentToUpdate={};
			
		
			
			
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
			
			const response =confirm('Etes vous sur de vouloir supprimer ce post?');
			if(response){
				this.findAllPosts();
			} else {
				console.log('gege');
			}
			
			
			
		},
		async deleteComment(comment){
			//this.$bvModal.hide('publication');
			//console.log(this.textArea);
			const requestOptions = {
				method: "Delete",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				
			};
			await fetch(this.urlApi + `/comments/${comment}`, requestOptions);
			
			const response =confirm('Etes vous sur de vouloir supprimer ce commentaire?');
			if(response){
				this.findAllPosts();
			} else {
				console.log('gege');
			}
			
			
			
		},
		async createComment(postId, userId,index){
			this.$bvModal.hide('publication');
			//console.log(this.textArea);
			
			const requestOptions = {
				method: "Post",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					comment:{
						comment_content: this.comment[index],
						post_id: postId,
						user_id: userId
					}
				})
			};
			await fetch(this.urlApi + `/comments`, requestOptions);
			await this.findAllPosts();
			this.comment=[];
			/* if(response){
				//this.findAllComments();
				//this.findAllComments()
			} else {
				console.log('gege');
			} */
			
			
			
		},
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
.actionsComment{
	align-self: flex-end;
	
}
.deleteComment{
	font-size: 0.7rem;
	margin-right: 1.5rem;
	margin-left: 0.5rem;
}
.updateComment{
	font-size: 0.7rem;
	
}

.commentCard{
	display:flex;
	width: fit-content;
	text-align: left;
	border-radius:30px;
	margin-bottom:0.1rem
	
	

}
.commentAndAction{
	display:flex;
	flex-direction: column;
	width: fit-content;
	//text-align:right;
	
}
.inputComment{
	border-radius:30px;
	margin-top:0.8rem
}
.headerCard{
	font-size: 0.8rem;
	display:flex;
	flex-direction: rows;
	margin-bottom: 1rem;
	justify-content:space-between ;

}
.textHeader{
	display: flex;
	flex-direction: column;
	text-align: left;
	margin-left:0.5rem;
	
}
.menuHeader{
	font-size:1rem
}

.authorImg{
	border-radius: 50%;
}
.col{
	padding:0;
	width:70%;
}
.card{
	//width:100%;
	padding:0.6rem;

}
.wall{
	margin-top: 5rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.post {
	margin-top:1rem;
	background-color:rgb(230, 227, 227)
}
.textPost{
	text-align: justify;
}	
.btnLikeComment{
	padding:0;
	border:none

	
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
.link, .link:hover{
	text-decoration:none;
	color:black
}
.linkUser:hover{
color:rgb(164, 61, 145)
}
////////////////////////////////@forward 

</style>