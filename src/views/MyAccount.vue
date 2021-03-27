<template>
  <div class="myAccount">
     <Nav></Nav>
      <h1>Mes informations</h1>
      <div>{{this.$store.state.user.firstName}}</div>
      <div>{{this.$store.state.user.lastName}}</div>
      <div>{{this.$store.state.user.email}}</div>
      <div>{{this.$store.state.user.nbPosts}}</div>
      <div>{{this.$store.state.user.nbComments}}</div>
      <div>{{this.$store.state.user.createdAt}}</div>
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
  
		};
	},
	components: {
		Nav
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
	},
	methods:{
	
	}
};
</script>