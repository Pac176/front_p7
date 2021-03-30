<template>
  <div class="myAccount">
    <Nav></Nav><br><br><br>
	<h1>Mettre a Jour mes informations</h1>
	<FormUpdateUser></FormUpdateUser>
	<PwdUpdate></PwdUpdate>

	
    
  </div>
</template>

<script>
// @ is an alias to /src

import Nav from '@/components/Nav.vue';
import FormUpdateUser from '@/components/FormUpdateUser.vue';
import PwdUpdate from '../components/PwdUpdate.vue';

import {mapState} from 'vuex';



export default {
  
	name: 'MyAccount',
	data(){
		return{
			
		};
	},
	components: {
		Nav,
		FormUpdateUser,
		PwdUpdate
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
	},
	methods:{
		
	},
	mounted(){
		
	
		
	}
};
</script>

<style lang='scss' scoped>
.myAccount{
	margin-top:2rem
}

</style>