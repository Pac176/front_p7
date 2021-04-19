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
	<b-col  md="7" sm style='padding:0 1.5 0 0 rem'>
		<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
			Inscription reussie!</b-alert>
		<b-link v-b-modal.publication @click='resetModal' class="link">
		<h2>Fil d'actualité</h2><br>
		<h2 v-if='noPosts' style='font-style:italic; color:#FD2D01;'>{{noPosts}}</h2><br>
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
			<b-card-text ><b-img   src="https://picsum.photos/50" fluid alt="Responsive image" class="authorImg link"></b-img></b-card-text>
				<div class='textHeader' >
					<b-card-text  class="authorPost link">{{ item.user.pseudo}}</b-card-text>
					<b-link class="link" v-b-tooltip.leftbottom.v-info ="momentDateMouse(item.createdAt)" >{{ momentDate(item.createdAt)}}</b-link>
				</div>
		</div>
		<div class="menuHeader">...</div>
		
		</div>
			<b-link v-if="item.user_id === $store.state.userId" class="link" v-b-modal.updatePublication @click='findOnePost(item.id)' ><b-card-text v-b-tooltip.right.hover.v-primary title="Modifier" class='textPost linkUser'>{{item.post_content}}</b-card-text></b-link>
			<b-card-text v-else class='textPost '>{{item.post_content}}</b-card-text><br>
			<div class="usersLikes" v-show='item.like.map(x=>x.user.pseudo).length>=1'><b-card-text v-b-tooltip.hover :title="item.like.map(x=>x.user.pseudo)" ><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1618751389/Group_3rondjaime_fszx9r.svg" alt="" height="20" ><span v-html="item.like.map(x=>x.user.pseudo).length" style='margin-left:0.4rem;'></span></b-card-text></div>
<!-- MenuPost -->	
		<b-row class="likeComment" >
			<b-col>
				<div  v-on:click='function(){likePost(item.id,index); userLike(item);outFocusButton(index)}' block variant="outline-secondary" class='btnLikeComment'>
					<div  v-if='userLike(item)'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1618753322/Group_1bluejaime_ymp6es.svg" alt="" height="22" ><b-card-text style='color:rgb(34,143,222); border:none'>J'aime</b-card-text></div>
					<div  v-else><img   src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="15" style=' border:none'><b-card-text >J'aime</b-card-text></div>
				</div>
				
			</b-col>
			<b-col>
				<div  @click="function(){setFocusInput( index ); switchToUpdate=false}" block variant="outline-secondary" class='btnLikeComment'>
					<div>
						<img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="15">
						<b-card-text >Répondre</b-card-text>
					</div>
				</div>
			</b-col>
			<b-col v-if="item.user_id === userId || user.is_admin === 1">
				<div :data-key="index" @click='deletePost(item.id,index)' block variant="outline-secondary"  class='btnLikeComment' >
					<div>
						<img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="15">
						<b-card-text  >Supprimer </b-card-text>
					</div>
				</div>
			</b-col>
		</b-row> 

<!-- comments -->
<div class='commentGroup' block>
	<div v-for="(comment) in allPosts[index].tblComments" :key="comment.id" class='commentAndAction'>
		<b-card class="commentCard">
				<div >
					<b-link href="#" class="link" style='font-size:0.7rem'>{{comment.user.pseudo}}</b-link>
					<b-card-text   class='textPost'><img src="" alt="">{{ comment.comment_content }}</b-card-text>
				</div>
		</b-card>
<!-- menu Comments -->
		<div v-if="comment.user_id === userId || user.is_admin === 1"  block variant="outline-secondary"  class='link actionsComment' style='font-size:0.6rem'>
			<b-link class='link updateComment'  @click='findOneComment(comment.id,index)'>Modifier</b-link>
			<b-link class='link deleteComment' @click='deleteComment(comment.id)' >Supprimer</b-link>
		</div>
	</div>
</div>	
<!-- input comment -->

		<b-form-group  v-if='switchToUpdate !== false'>
			<b-input   :data-key="index" class="inputComment"  v-model='commentToUpdate.comment_content' v-on:keyup.enter="updateComment(index)"></b-input>
		</b-form-group>
		<b-form-group  v-else>
			<b-input   :data-key="index" class="inputComment"  v-model='newComment[index]' v-on:keyup.enter="createComment(item.id,user.id,index)"></b-input>
		</b-form-group>


		
			
	</b-card>
</b-col>
	<b-col  md= '2' sm> 
	
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
			isUserLike:[],
			noPosts:null,
			switchToUpdate:false,
			postToUpdate:{},
			//commentToUpdate:'er',
			newComment:[],
			allComments:[],
			startComment:-1, //false, //0,
			dropdownDisplay :'display:none',
			textArea:"Quoi de neuf? " + this.$store.state.user.pseudo + "......",
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
		userLike(item){
			if(item.like.length !== 0) {
				console.log('ok');
				return item.like.includes(item.like.find(el=>el.user.id === this.user.id));
				
				
					
			}
		
		},
		setFocusInput(index) {
			const inputs = document.querySelectorAll('.inputComment');
			inputs.forEach(ele => { 
				if (ele.dataset.key == index) {
					ele.focus();
				} 
			});
		},
		outFocusInput(index) {
			const inputs = document.querySelectorAll('.inputComment');
			console.log(inputs);
			inputs.forEach(ele => { 
				if (ele.dataset.key == index) {
					ele.blur();
				} 
			});
		},
		outFocusButton(index) {
			const buttons = document.querySelectorAll('.btnLikeComment');
			console.log(buttons);
			buttons.forEach(ele => { 
				if (ele.dataset.key == index) {
					ele.blur();
				} 
			});
		},
   
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
			} else if(this.allPostsData.count === 0){
				this.noPosts = this.allPostsData.message;
				return this.allPostsInStore("");
			}else{
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
			this.setFocusInput(index);
			this.switchToUpdate = true;
	
		
			
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
			this.textArea= "Quoi de neuf?" + this.$store.state.user.pseudo + "......";
			this.noPosts=null;
			
			
			
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
		async updateComment(index){
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
			this.switchToUpdate = false;
			this.outFocusInput(index);
			
			
		},
		async deletePost(post,index){
			//this.$bvModal.hide('publication');
			//console.log(this.textArea);
			const requestOptions = {
				method: "Delete",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				
			};
			const response =confirm('Etes vous sur de vouloir supprimer ce post?');
			
			
			if(response){
				await fetch(this.urlApi + `/posts/${post}`, requestOptions);
				this.findAllPosts();
				console.log(this.allPosts);
			} else {
				this.outFocusButton(index);
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
						comment_content: this.newComment[index],
						post_id: postId,
						user_id: userId
					}
				})
			};
			await fetch(this.urlApi + `/comments`, requestOptions);
			await this.findAllPosts();
			this.newComment=[];
			this.outFocusInput(index);
			/* if(response){
				//this.findAllComments();
				//this.findAllComments()
			} else {
				console.log('gege');
			} */
			
			
			
		},
		async likePost(postId){
			console.log('gege');
			const requestOptions = {
				method: "Post",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body:JSON.stringify({
					like:{ 
						postId: postId,
						userId: this.userId
					}
				})
			};
			await fetch(this.urlApi + `/posts/like`, requestOptions);
			this.findAllPosts();
			
		
			
			
		},
	},
	mounted(){
		console.log(this.allPosts);
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
.usersLikes{
	display:flex;
	font-style:italic;
	color:rgb(48, 104, 189)
}
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
	margin-bottom:0.1rem;
	margin-top:0.5rem;
	background-color:rgb(235, 221, 221)
	

}
.commentAndAction{
	display:flex;
	flex-direction: column;
	width: fit-content;
}

.inputComment{
	border-radius:30px;
	margin: 0.8rem 0.5rem 0.5rem 0.5rem;
	max-width:-webkit-fill-available;
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
	background-color:rgb(255, 252, 252)
}
.textPost{
	text-align: justify;
}	
.btnLikeComment{
	display:flex;
	justify-content: center;
	align-items: center;
	height: 3rem;
	padding:0;
	border:none;	
	text-decoration: none;
	color: rgb(206, 48, 48);
	font-size:0.8rem;
	cursor: pointer;
	border-top:1px rgb(235, 185, 185) solid;
	border-bottom:1px rgb(235, 185, 185) solid
}
.btnLikeComment:hover{
	background-color: rgb(230, 210, 208);
	cursor: pointer;
	border-radius: 20rem;
	color:rgb(34,143,222)
}
.likeComment {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	width:100%;
	margin:0;
	margin-bottom: 0.5rem;
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
	border:1px rgb(224, 201, 201) solid;
	padding-left:0.8rem;
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