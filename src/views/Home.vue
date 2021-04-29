<template>
  <div class='home'>
     <Nav></Nav><br><br><br><br>
     <b-link  style='text-decoration:none' class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible  :variant='variantResult'  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged" id='alert'>
    {{apiResponse.message}}</b-alert></b-link>
     <h1>Bienvenue sur le reseau social de l'entreprise</h1>
      <img id="homeLogo" src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616663942/icon-above-font_hzocsv.svg" alt="logo" width="500rem" height="500rem">
     </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';
export default {
	name: 'Home',
	data(){
		return{
			apiResponse:{},
			variantResult:"",
			dismissSecs: 5,
			dismissCountDown: 0,
		};
	},
	components: {
		Nav
	},
	computed:{
		...mapState(['deleteAccountSuccess','deleteAccountRequest','successSubscribe'])
	},
	methods:{
		alertHover() {
			this.dismissCountDown = true;
		},
		alertHoverOut() {
			this.dismissCountDown = 1;
		},
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert(apiResponse, variant) {
			this.variantResult = variant;
			this.apiResponse = apiResponse;
			this.dismissCountDown = this.dismissSecs;
		},
		successDeleteAccountAlert(){
			this.$store.commit('DELETESUCCESS');
		},
	
	},
	mounted(){
		
		if(this.deleteAccountSuccess){
			this.showAlert(this.deleteAccountRequest, 'success');
			this.successDeleteAccountAlert(); 
		}
	},
};
</script>

<style lang='scss' scoped>
h1 {
  color:rgb(228, 17, 17);
  margin-bottom: 2rem;
}
#homeLogo {
  width:50%;
}
</style>