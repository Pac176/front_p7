<template>
  <div class="myAccount">
     <Nav></Nav>
      <h1>Mes informations</h1>
      <div>{{this.$store.state.userStore.firstName}}</div>
      <div>{{this.$store.state.userStore.lastName}}</div>
      <div>{{this.$store.state.userStore.email}}</div>
      <div>{{this.$store.state.userStore.nbPosts}}</div>
      <div>{{this.$store.state.userStore.nbComments}}</div>
      <div>{{this.$store.state.userStore.createdAt}}</div>
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
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','userStore'])
	},
	methods:{
	
	}
};
</script>