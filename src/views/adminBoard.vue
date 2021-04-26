<template>
	<div>
 		<Nav></Nav><br><br><br><br>
			<div>Nombre d'utilisateurs inscrits: {{allUsers.length}}</div>
			<div>Nombre de posts publiés:{{allPosts.length}} </div><br>
			<b-table striped hover :items="allUsers" :fields="fields"  selectable select-mode='single' @row-selected="onRowSelected">
			</b-table>
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
			selected:[0],
			fields:[
				{
					key: 'id',
					label:'index',
					sortable: true
				},
				{
					key: 'first_name',
					sortable: true
				},
				{
					key: 'last_name',
					sortable: true
				},
				{
					key: 'pseudo',
					sortable: true
				},
				{
					key: 'nb_posts',
					sortable: true
				},
				{
					key: 'nb_connections',
					sortable: true
				},
				{
					key: 'is_admin',
					sortable: true
				},
			], 
			updateUserStatut:{},
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
		onRowSelected(items ) {
			this.selected = items;
			console.log(this.selected[0]);
			if(this.selected){
				if(this.selected[0].id === 1){
					return 	alert("Vous ne pouvez pas changer le statut de l'admin en chef!!");
				} else{
					this.onAdminUser(this.selected[0]);
				}
				
			}
		},
		allUsersInStore(allUsersData){
			this.$store.commit('ALLUSERS',allUsersData);
		},
		userInStore(userData){
			this.$store.commit('USER',userData);
		},
		async findOneUser () {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
				this.userData = await response.json();
				console.log(this.userData.data);
				this.updateUserStatut = this.userData.data;
			} catch (error) {
				console.log(error,'erreure sur la findOneUser');
			}
			
		},
		async onAdminUser (user) {
			try {
				const findOneUserOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const responseFindOne = await fetch(this.urlApi + `/users/${user.id}`, findOneUserOptions);
				this.userData = await responseFindOne.json();
				console.log(this.userData.data);
				this.updateUserStatut = this.userData.data;
				const response = confirm('Etes vous sur de changer de statut de cet utilisateur?');
				if(response){
					const requestOptions = {
						method: "Put",
						headers: { 
							"Content-Type": "application/json",
							"Authorization": `Bearer ${this.token}`},
						body:JSON.stringify({
							first_name: user.first_name,
							last_name:user.last_name,
							pseudo:user.pseudo,
							email:this.updateUserStatut.email,
							password: this.updateUserStatut.password,
							is_admin: user.is_admin === 0 ?  1 : 0
						})
					};
					const response = await fetch(this.urlApi + `/users/${user.id}`, requestOptions);
					await response.json();
					await this.findAllUsers();
					this.selected = user;
				}
			} catch (error) {
				console.log(error,'erreure sur la onAdminUser');
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
				console.log(error, 'Erreure sur la findAllUsers');
			}
		
		},
		
	},
	mounted(){
		this.findAllUsers();
	}
};
</script>


<style lang="scss" scoped>

</style>