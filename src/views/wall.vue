<template>
  <div class="wall">
    <Nav></Nav>
	<b-alert variant="success" v-if="this.$store.state.successSubscribe" show >Inscription reussie!</b-alert>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';

export default {
	name: 'wall',
	components: {
		Nav
	},
	methods:{
		successSubscrirtionShow(){
			this.$store.commit('successSubscribeMutation');
		},
	}
};
</script>
