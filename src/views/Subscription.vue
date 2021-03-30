<template>
  <div class="subscription">
	<Nav></Nav><br><br><br>
	<h1>Entrez vos informations:</h1>
	<FormValidate></FormValidate>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import FormValidate from '@/components/FormValidate.vue';

export default {
	name: 'Subscription',
	data(){
		return{
			
		};
	},
	components: {
		Nav,
		FormValidate
	},
	methods:{
		
	}
};



</script>


<style lang="scss" scoped >
.subscription{
	margin-top:2rem
}

</style>





