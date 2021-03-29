<template>
  <div class="myAccount">
     <Nav></Nav>
    <h1>Mes informations</h1>

    <div class="user">{{user.first_name}}</div>
    <div class="user">{{user.last_name}}</div>
    <div class="user">{{user.email}}</div>
    <div class="user">{{user.nb_posts}}</div>
    <div class="user">{{user.createdAt}}</div>
    
  </div>
</template>

<script>
// @ is an alias to /src

import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';

export default {
  
	name: 'MyAccount',
	data(){
		return{
			userData:{},
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	components: {
		Nav
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
	},
	methods:{
		userInStore(userData){
			this.$store.commit('USER',userData);
		},
		async findOneUser () {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.token}`},
			};
			const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
			console.log(response);
			this.userData = await response.json();
			this.userInStore(this.userData.data) ;
			console.log(this.user);
		
		},
	},
	mounted(){
		this.findOneUser();
	
		
	}
};
</script>

<style scoped lang='scss'>
.user {
	margin-top: 4rem
}
</style>