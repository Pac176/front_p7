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

<style scoped lang='scss'>
.user {
	margin-top: 4rem
}
</style>