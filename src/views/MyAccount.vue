<template>
  <div class="myAccount">
	<Nav></Nav><br><br><br>
	<h1>Mettre a Jour mes informations</h1>
	
	<b-row>
		<b-col  class="formUpdateUser" md="6"><FormUpdateUser></FormUpdateUser></b-col> 
		<b-col  class="formPwdUpdateUser" md="6"><PwdUpdate></PwdUpdate></b-col> 
	</b-row>
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
.formUpdateUser, .formPwdUpdateUser {
	display: flex;
    justify-content: center;
}
</style>²