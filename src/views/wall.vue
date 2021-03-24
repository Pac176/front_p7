<template>
  <div class="wall">
    <Nav></Nav>
	<b-alert  :show="dismissCountDown" dismissible variant="success"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     Inscription reussie!</b-alert>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';

export default {
	name: 'wall',
	data(){
		return{
			dismissSecs: 5,
			dismissCountDown: 0,
		};
	},
	components: {
		Nav
	},
	methods:{
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert() {
			this.dismissCountDown = this.dismissSecs;
		},
		successSubscrirtionShow(){
			this.$store.commit('successSubscribeMutation');
		},
	},
	mounted(){
		if (this.$store.state.successSubscribe){
			this.showAlert();
			this.successSubscrirtionShow();
		}
	}
};
</script>
