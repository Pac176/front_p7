<template>
  <div class="subscription">
	<Nav></Nav>
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
h1{
	margin-top:6rem;
}
.subscription{
	display:flex;
	flex-direction: column;
	
}



</style>





