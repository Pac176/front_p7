<template>
  <div class="myAccount">
    <Nav></Nav><br><br><br>
	<h1>Mettre a Jour mes informations</h1>
	<FormValidate ></FormValidate>
	
    
  </div>
</template>

<script>
// @ is an alias to /src

import Nav from '@/components/Nav.vue';
import FormValidate from '@/components/FormValidate.vue';
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
		Nav,
		FormValidate
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
					"Authorization": `Bearer ${this.token}`},
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

<style lang='scss'>
.myAccount{
	margin-top:2rem;
}

</style>