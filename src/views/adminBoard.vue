<template>
	<div>
		<Nav></Nav><br><br><br><br>
			<b-link class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible :variant='variantResult'  @dismiss-count-down="countDownChanged" >
			{{apiResponse.message}}</b-alert></b-link>
			<h3>Pour changer le statut d'un utilisateur veuillez selectionner la ligne de cet utilisateur</h3><br>
			<span>{{allUsers[0].first_name}} {{allUsers[0].last_name}} est admin de base, il ne peut pas changer de statut</span><br><br>
			<b-table striped hover :items="allUsers" :fields="fields"  selectable select-mode='single' @row-selected="onRowSelected" selected-variant="danger">
			</b-table>
			<b-button @click='onAdminUser(selected[0]); showAlert({message:`${selected[0].pseudo} a bien changé de statut`}, "success")' v-if="selected[0] && selected[0].id !==1" variant="danger">Changer le statut de {{selected[0].pseudo}}?</b-button>
			<div>Nombre d'utilisateurs inscrits: {{allUsers.length}}</div>
			<div>Nombre de posts publiés:{{allPosts.length}} </div><br>
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
			selected:[],
			oldSelected:[],
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
			dismissSecs: 5,
			dismissCountDown: 0,
			variantResult:"",
			apiResponse:{},
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
		alertHover(){
			this.dismissCountDown = true;
		},
		alertHoverOut(){
			this.dismissCountDown = 1;
		},
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert(apiResponse, variant) {
			this.variantResult = variant;
			this.apiResponse = apiResponse;
			this.dismissCountDown = this.dismissSecs;
		},
		async onRowSelected(items ) {
			try {
				this.selected = items;
				
			} catch (error) {
				console.log(error,'onrowselected');
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