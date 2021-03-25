<template>
  <div class="myAccount">
     <Nav></Nav>
      <h1>Mon Compte</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';
export default {
  
	name: 'MyAccount',
	components: {
		Nav
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin'])
	},
	methods:{
		async findOneUser () {
			const requestOptions = {
				method: "POST",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body: JSON.stringify({
					first_name:this.first_name,
					last_name:this.last_name,
					pseudo:this.pseudo,
					email:this.email,
					password:this.password
				})
			};
			const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
			console.log(response);
			this.dataResponse = await response.json();
		}
	}
};
</script>