<template>

<div>
 <Nav></Nav><br><br><br><br>
<div>Nombre d'utilisateurs inscrits: {{allUsers.length}}</div>
<div>Nombre de posts publiés: {{allPosts.length}}</div>
<div>Nombre de commentaires: </div>

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
			newComment:[],
			allComments:[],
			startComment:-1, //false, //0,
			dropdownDisplay :'display:none',
			textArea:"Quoi de neuf? " + this.$store.state.user.pseudo + "......",
			password:null,
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
		
		this.findAllPosts();
		this.findAllUsers();
		
		
		
	}
};
</script>


<style lang="scss" scoped>

</style>