<template>
	<div>
		<Nav></Nav><br>
		<b-row class="wall">
		<b-col md="2" sm>
			<h4>{{user.first_name}} {{user.last_name}}</h4>
			<h5> ({{user.pseudo}})</h5>
			<div style='font-size:0.7rem'>Inscrit le {{momentDateMouse(user.createdAt)}}</div>
		</b-col>
		<b-col  md="8" sm style='padding:0 1.5 0 0 rem'>
			<h2 v-if='allPostsByUserId.length >= 1'>Fil d'actualité de {{allPostsByUserId[0].user.pseudo}}</h2>
			<div v-if='allPostsByUserId.length >= 1' style='font-size:0.7rem'>Inscrit le {{momentDateMouse(allPostsByUserId[0].user.createdAt)}}</div>
			<div v-if='allPostsByUserId.length >= 1' style='font-size:0.7rem' >Dernière connexion {{momentDateMouse(allPostsByUserId[0].user.updatedAt)}}</div><br> 
			<h2 v-if='noPosts' style='font-style:italic; color:#FD2D01;'>{{noPosts}}</h2><br>
<!-- modals -->
					<b-modal id="updatePublication" hide-footer size="lg" @close='alertCloseModal'>
						<template #modal-title >Modifier ma publication</template>
							<div class="d-block text-center">
								<div>
									<b-form-textarea  v-model='postToUpdate.post_content' autofocus id="updateTextarea" style='border: none;  -webkit-box-shadow: none;'   rows="1"	max-rows="10"></b-form-textarea>
									<pre class="mt-3 mb-0"></pre>
								</div>
							</div>
						<b-button  class="mt-5" variant='outline-primary' block @click="updatePost">Modifier</b-button>
					</b-modal>
<!-- publications -->
				<b-card title="" sub-title="" v-for="(item,index) in allPostsByUserId" :key="item.id" class="post">
					<div class='headerCard'>
						<div  class='headerCard'>
							<b-img   src="https://picsum.photos/50" fluid alt="Responsive image" class="authorImg link"></b-img>
								<div class='textHeader' >
									<div  class="authorPost link">{{ item.user.pseudo}}</div>
									<b-link class="link" v-b-tooltip.leftbottom.v-info ="momentDateMouse(item.createdAt)" >{{ momentDate(item.createdAt)}}</b-link>
								</div>
						</div>
					</div>
					<b-link v-if="item.user_id === $store.state.userId" class="link" v-b-modal.updatePublication @click='findOnePost(item.id)' ><b-card-text v-b-tooltip.right.hover.v-primary title="Modifier" class='textPost linkUser'>{{item.post_content}}</b-card-text></b-link>
					<b-card-text v-else class='textPost '>{{item.post_content}}</b-card-text><br>
<!-- CounterLike -->			
					<div class='counterLike'>
						<div class="usersLikes" v-show='item.like.map(x=>x.user.pseudo).length>=1'>
							<b-card-text v-b-tooltip.hover :title="item.like.map(x=>x.user.pseudo + ',	')" >
								<img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1618751389/Group_3rondjaime_fszx9r.svg" alt="" height="20" >
								<span v-html="item.like.map(x=>x.user.pseudo).length" style='margin-left:0.4rem;'></span>
							</b-card-text>
						</div>
					</div>
<!-- MenuPost -->	
					<b-row class="likeComment" >
					<b-col>
						<div  v-on:click='function(){likePost(item.id,item.user.id,index); userLike(item);outFocusButton(index)}' block variant="outline-secondary" class='btnLikeComment'>
							<div  v-if='userLike(item)'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1618753322/Group_1bluejaime_ymp6es.svg" alt="" height="22" >
							<b-card-text style='color:rgb(34,143,222); border:none'>J'aime</b-card-text></div>
							<div  v-else>
								<img   src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616753162/comme_mwyvnb.svg" alt="" height="15" style=' border:none'>
								<b-card-text >J'aime</b-card-text></div>
						</div>
					</b-col>
					<b-col>
						<div  @click="function(){setFocusInputCreate( index )}" block variant="outline-secondary" class='btnLikeComment'>
							<div>
								<img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616754590/commentaire-bulle-ovale-blanche_vftrbh.svg" alt="" height="15">
								<b-card-text >Répondre</b-card-text>
							</div>
						</div>
					</b-col>
					<b-col v-if="item.user_id === userId || user.is_admin === 1">
						<div :data-key="index" @click='deletePost(item.id,item.user.id,index)' block variant="outline-secondary"  class='btnLikeComment' >
							<div>
								<img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616755730/delete_sg8ndk.svg" alt="" height="15">
								<b-card-text  >Supprimer</b-card-text>
							</div>
						</div>
					</b-col>
					</b-row><br> 
					<div style='font-weight:bolder'>Laissez un commentaire...</div>
					<div v-if="allPostsByUserId[index].tblComments.length < 4">
					<div class='commentGroup' block>
						<div v-for="(comment) in allPostsByUserId[index].tblComments" :key="comment.id" class='commentAndAction'>
							<div class='commentMenu'>
								<div class='commentCollapseMenu'>
								<b-card class="commentCard">
									<div class='commentText'>
										<div href="#" class="link authorComment" style='font-size:0.7rem'>{{comment.user.pseudo}}</div>
										<b-card-text   class='textPost'><img src="" alt="">{{ comment.comment_content }}</b-card-text>
									</div>
								</b-card>
	<!-- menu Comments -->
							
							<b-link v-if="comment.user_id === userId || user.is_admin === 1" v-b-toggle="'collapseMenu'+ comment.id" class='link menuCommentCollapse'><img class='imgMenuCollapse' src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1619594749/menucollapsecomment_ggusga.svg" width='20rem' height="20rem" alt='menuCommentCollapse'></b-link>
									</div>
									<b-collapse :id="'collapseMenu'+ comment.id" :data-key="index" class='menuCommentCollapse'>
									<div v-if="comment.user_id === userId || user.is_admin === 1"  block variant="outline-secondary"  class='link actionsComment' style='font-size:0.6rem'>
										<b-link class='link updateComment'  @click='findOneComment(comment.id,index)' >Modifier</b-link>
										<b-link class='link deleteComment' @click='deleteComment(comment.id)' >Supprimer</b-link>
									</div>
									</b-collapse>
							</div>
						</div>
					</div>
					</div>
<!-- Au dela de x comments -->
					<div v-else>
					<b-link  v-b-toggle="'my-collapse-'+ index" class='link not-collapsed'>il y a {{allPostsByUserId[index].tblComments.length}} commentaire(s) sur ce post...</b-link>
					<b-collapse :id="'my-collapse-'+ index" :data-key="index">
						<div class='commentGroup' block>
							<div v-for="(comment) in allPostsByUserId[index].tblComments" :key="comment.id" class='commentAndAction'>
								<div class='commentMenu'>
									<div class='commentCollapseMenu'>
									<b-card class="commentCard">
										<div class='commentText'>
											<div href="#" class="link authorComment" style='font-size:0.7rem'>{{comment.user.pseudo}}</div>
											<b-card-text   class='textPost'><img src="" alt="">{{ comment.comment_content }}</b-card-text>
										</div>
									</b-card>
	<!-- menu Comments au dela de x comments-->
								<b-link v-b-toggle="'collapseMenu'+ comment.id" class='link menuCommentCollapse'><img src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1619594749/menucollapsecomment_ggusga.svg" height="20" class='imgMenuCollapse' alt='menuCommentCollapse'></b-link>
									</div>
									<b-collapse :id="'collapseMenu'+ comment.id" :data-key="index" class='menuCommentCollapse'>
									<div v-if="comment.user_id === userId || user.is_admin === 1"  block variant="outline-secondary"  class='link actionsComment' style='font-size:0.6rem'>
										<b-link class='link updateComment'  @click='findOneComment(comment.id,index)' style='font-size:0.8rem; font-weight:bolder'>Modifier</b-link>
										<b-link class='link deleteComment' @click='deleteComment(comment.id,item.user_id)' style='font-size:0.8rem; font-weight:bolder'>Supprimer</b-link>
									</div>
									</b-collapse>
								</div>
							</div>
						</div>
					</b-collapse>
					</div>
<!-- input comment -->
				<b-form-group  v-if='switchToUpdate[index] === true'>
					<b-input   :data-key="index" class="inputComment"  v-model='commentToUpdate.comment_content' v-on:keyup.enter="updateComment(index)" ></b-input>
				</b-form-group>
				<b-form-group  v-else>
					<b-input   :data-key="index" class="inputComment"  v-model='newComment[index]' v-on:keyup.enter="createComment(item.id,user.id,index)" ></b-input>
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
	name: 'wallUser',
	data(){
		return{
			isUserLike:[],
			noPosts:null,
			switchToUpdate:[],
			commentToUpdate:{},
			postToUpdate:{},
			newComment:[],
			startComment:-1, //false, //0,
			dropdownDisplay :'display:none',
			textArea:"Quoi de neuf? " + this.$store.state.user.first_name + "......",
			password:null,
			dismissSecs: 5,
			dismissCountDown: 0
			
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
			'urlApi',
			'wallUserId',
			'successSubscribe',
			'token',
			'isConnect',
			'userId',
			'isAdmin',
			'user',
			'allUsers',
			'allPosts',
			'allComments',
			'allPostsByUserId']),
	},
	methods:{
		switchToUpdateReset(){
			for (let i=0; i<this.allPostsByUserId.length;i++){
				this.switchToUpdate[i]=false;
			}
		},
		userLike(item){
			if(item.like.length !== 0) {
				return item.like.includes(item.like.find(comment=>comment.user.id === this.user.id));
			}
		},
		setFocusInputUpdate(index) {
			const inputs = document.querySelectorAll('.inputComment');
			for (let i = 0; i < inputs.length; i++) {
				if(inputs[i].dataset.key == index){
					inputs[i].focus();
				} 
			}
		},
		setFocusInputCreate(index) {
			const inputs = document.querySelectorAll('.inputComment');
			for (let i = 0; i < inputs.length; i++) {
				if(inputs[i].dataset.key == index){
					inputs[i].focus();
				} 
			}
			this.commentToUpdate = {};
			this.switchToUpdate[index] =false;
		},
		outFocusInput(index) {
			const inputs = document.querySelectorAll('.inputComment');
			inputs.forEach(input => { 
				if (input.dataset.key == index) {
					input.blur();
				} 
			});
			this.switchToUpdate[index]=false;
		},
		outFocusButton(index) {
			const buttons = document.querySelectorAll('.btnLikeComment');
			buttons.forEach(button => { 
				if (button.dataset.key == index) {
					button.blur();
				} 
			});
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
		allCommentsInStore(allCommentsData){
			this.$store.commit('ALLCOMMENTS',allCommentsData);
		}, 
		allUsersInStore(allUsersData){
			this.$store.commit('ALLUSERS',allUsersData);
		}, 
		wallUserIdInStore(wallUserData){
			this.$store.commit('WALLUSERID', wallUserData);
		},
		async findAllPosts() {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/posts`, requestOptions);
				this.allPostsData = await response.json();
				if(this.allPostsData.count !== 0 && this.isConnect){
					return this.allPostsInStore(this.allPostsData.data);

				} else if(this.allPostsData.count === 0){
					this.noPosts = this.allPostsData.message;
					return this.allPostsInStore("");
				}else{
					this.allPostsInStore('');
				}
			} catch (error) {
				console.log(error,"erreure sur findAllPosts");
			}
		}, 
		async findOnePost(postId) {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/posts/${postId}`, requestOptions);
				this.onePostData = await response.json();
				this.postToUpdate = this.onePostData.data;
		
			} catch (error) {
				console.log(error, 'Errreure sur le findOnePost');
			}
		},
		async findOneComment(commentId,index) {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/comments/${commentId}`, requestOptions);
				this.oneCommentData = await response.json();
				this.commentToUpdate = this.oneCommentData.data;
				this.switchToUpdateReset();
				this.switchToUpdate[index] = true;
				await this.findAllPostsByUserId(this.wallUserId);
				this.setFocusInputUpdate(index);
			} catch (error) {
				console.log(error,'Erreure sur la findOneComment');
			}
		},
		async findAllPostsByUserId(userId) {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/posts/users/${userId}`, requestOptions);
				this.allPostsByUserIdData = await response.json();
				if(this.allPostsByUserIdData.count !== 0 && this.isConnect){
					this.allPostsByUserIdInStore(this.allPostsByUserIdData.data);
					
				} else{
					this.allPostsByUserIdInStore('');
					this.noPosts = "Vous n'avez aucune publication";
				}
			} catch (error) {
				console.log(error, 'Erreure sur la findAllPostsByUserId');
			}
			
			
			
		},
		async findAllUsers() {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/users`, requestOptions);
				this.allUsersData = await response.json();
				if(this.allUsersData.length !== 0 && this.isConnect){
					return this.allUsersInStore(this.allUsersData.data);
				} 
		
			} catch (error) {
				console.log(error,'Erreure sur la findAllUsers');
			}
			
		}, 
		async updatePost(){
			try {
				this.$bvModal.hide('updatePublication');
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
				await this.findAllPostsByUserId(this.wallUserId);
			} catch (error) {
				console.log(error,'Erreure sur la updatePost');
			}
		},
		async updateComment(index){
			try {
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
				const response =await fetch(this.urlApi + `/comments/${this.commentToUpdate.id}`, requestOptions);
				await response.json();
				this.outFocusInput(index);
				this.commentToUpdate={};
				await this.findAllPostsByUserId(this.wallUserId);
				
			} catch (error) {
				console.log(error,'Erreure sur la updateComment');
			}  
		},
		async deletePost(postId,userId,index){
			try {
				const requestOptions = {
					method: "Delete",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				
				};
				const response =confirm('Etes vous sur de vouloir supprimer ce post?');
				if(response){
					await fetch(this.urlApi + `/posts/${postId}`, requestOptions);
					this.findAllPostsByUserId(userId);
				} else {
					this.outFocusButton(index);
				}
			} catch (error) {
				console.log(error,'Erreure sur la deletePost');
			}
			
			
			
			
		},
		async createComment(postId, userId,index){
			try {
				this.$bvModal.hide('publication');
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
				await this.findAllPostsByUserId(this.wallUserId);
				this.newComment=[];
				this.outFocusInput(index);
			} catch (error) {
				console.log(error,'Erreure sur la createComment');
			}
			
						
		},
		async deleteComment(comment, userId){
			try {
				const response =confirm('Etes vous sur de vouloir supprimer ce commentaire?');
				if(response){
					const requestOptions = {
						method: "Delete",
						headers: { 
							"Content-Type": "application/json",
							"Authorization": `Bearer ${this.token}`},
				
					};
					await fetch(this.urlApi + `/comments/${comment}`, requestOptions);
			
					await this.findAllPostsByUserId(userId);
				} 
			
			} catch (error) {
				console.log(error,'Erreure sur la deleteComment');
			}
		},
		async likePost(postId,userId){
			try {
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
				await this.findAllPostsByUserId(userId);
			} catch (error) {
				console.log(error,'Erreure sur la likePost');
			}
		},
	},
	
};
</script>

<style lang="scss" scoped>
@media screen and (max-width:500px) {
	
}
.commentCollapseMenu{
	display:flex;
}
.menuCommentCollapse{
	align-self: center;
}
.imgMenuCollapse:hover{
	border-radius:50%;
	background-color: rgb(211, 204, 204);
}
#menuCommentCollapse{
	align-self: center;
}
.commentText{
	display: flex;
	flex-direction: column;
}
.authorPost, .authorComment{
	font-weight:bolder;
}
.counterLike{
	height: 2rem;
}
.usersLikes{
	display:flex;
	font-style:italic;
	color:#2B5BDE
}
.actionsComment{
	align-self: flex-end;
	text-align-last: justify;
}
.deleteComment{
	font-size: 0.7rem;
	margin-right: 1.5rem;
	margin-left: 0.5rem;
	font-size:0.8rem; 
	font-weight:bolder
}
.updateComment{
	font-size: 0.7rem;
	font-size:0.8rem; 
	font-weight:bolder
}
.commentCard{
	display:flex;
	width: fit-content;
	text-align: left;
	border-radius:15px;
	margin-bottom:0.1rem;
	margin-top:0.5rem;
	background-color:rgb(236, 228, 228);
	border: 1px rgba(121, 102, 102, 0.6) dashed
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
	padding:0.4rem;
}
.post {
	margin-top:1rem;
	background-color:rgb(250, 244, 244);
	border: 2mm ridge rgba(189, 188, 188, 0.6);
}
.textPost{
	text-align: justify;
}	
.postUpdate:hover{
	background-color:red

}
.btnLikeComment{
	display:flex;
	justify-content: center;
	align-items: center;
	height: 3rem;
	padding:0;
	border:none;	
	text-decoration: none;
	font-size:0.8rem;
	cursor: pointer;
	border-top:1px rgb(235, 185, 185) solid;
	border-bottom:1px rgb(235, 185, 185) solid;
	font-weight: bolder
}
.btnLikeComment:hover{
	background-color: #ece1e0;
	cursor: pointer;
	border-radius: 20rem;
	color:#2B5BDE
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
	border-radius: 30px;
	height:3rem;
	align-items: center;
	display: flex;
	align-items: center;
	text-decoration:none;
	border:1px rgb(224, 201, 201) solid;
	padding-left:0.8rem;
	color: rgba(54, 37, 37, 0.993);
	font-weight: bolder;
	border: 2.5mm ridge rgba(180, 155, 155, 0.6);
}
.card-body{
	padding:0;
}
.link, .link:hover{
	text-decoration:none;
	color:black
}
.linkUser:hover{
color:#2B5BDE;
background-color:#ece1e0;
}
.row{
	margin:0
}
.wall{
	margin-top: 5rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>