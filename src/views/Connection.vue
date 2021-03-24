<template>
  <div class="connect">
   <Nav></Nav>
	<div class="vue-template">
        <b-form class="form" @submit="onConnect">
		<b-alert variant="danger" v-if="this.failedConnect" show>{{this.data.error}}</b-alert> 
			<b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
            <b-form-input style="font-style:italic" id="input-5" v-model="form.email" type="email" placeholder="Entrez votre email" required></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" v-model="form.password" type="password" placeholder="Entrez votre mot de passe"   required ></b-form-input>
            </b-form-group>
            <button type="submit"   class="btn btn-success btn-lg btn-block">Connexion</button>
            <p class="forgot-password text-right mt-2 mb-4">
            <router-link to="/motDePasseOublie">Mot de passe oublié ?</router-link>
            </p>
       </b-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';

export default {
	name: 'Connect',
	data(){
		return{
			failedConnect: false,
			data:"",
			form:{
				password:"",
				email:""
			},
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	components: {
		Nav
	},
	methods:{
		async onConnect (event) {
			try {
				event.preventDefault();
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": "Bearer my-token"},
					body: JSON.stringify(this.form)
				};
				const response = await fetch(this.urlApi + "/users/login", requestOptions);
				this.data = await response.json();
				if(response.ok === true ){
					console.log(this.$store.state.token);
					this.$store.state.token = this.data.token;
					this.$store.state.isConnect = true;
					this.$router.push('wall');
					
				}else{

					this.failedConnect = true;
					console.log("niette");}
  
			} catch (e) {
				console.log(e);
			}

			
		}

    
	}
};


</script>

<style lang="scss" >
@media screen and (max-width:500px) {
	.form{
	display:flex;
	flex-direction: column;
	width:95%

}
}
@media screen and (min-width:500px) {
	.form{
	width:50%

}

}

.vue-template{
	display: flex;
	margin:0;
	text-align: left;
	justify-content: center;
	padding-top: 4rem;
  }
</style>
