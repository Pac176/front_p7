<template>
  <div class="subscription">
	<Nav></Nav><br><br><br>
	<h1>Entrez vos informations:</h1>
	<FormValidateUser class="formValidateUser"></FormValidateUser>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import FormValidateUser from '../components/FormValidateUser.vue';
import {mapState} from 'vuex';

export default {
	name: 'Subscription',
	data(){
		return{
			first_name:null,
			last_name:null,
			pseudo:null,
			password:null,
			email:null,	
		};
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
	},
	components: {
		Nav,
		FormValidateUser
	},
	methods:{
		
	}
};



</script>


<style lang="scss" scoped >
.subscription{
	margin-top:2rem;
	display:flex;
	flex-direction: column;
	
}



</style>





