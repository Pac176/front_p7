<template>
  <div class="subscription">
   <Nav></Nav>
     <div class="vue-template">
		<b-alert variant="danger" v-if="failure" show>Inscription incomplète, verifier les champs!</b-alert> 
        <b-form class="form" @submit="onSubscription" >
            <b-form-group style="font-weight:bold" id="input-group-1"  label="Votre Nom:" label-for="input-1" >
              <b-form-input style="font-style:italic" id="input-1" v-model="form.first_name" placeholder="Entrez votre nom (uniquement des lettres)" required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-2"  label="Votre prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2" v-model="form.last_name" placeholder="Entrez votre prénom (uniquement des lettres)" required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3" v-model="form.pseudo" placeholder="Entrez votre pseudo (uniquement des lettres)" ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" v-model="form.password" type="password" placeholder="Entrez votre mot de passe"   required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
              <b-form-input style="font-style:italic" id="input-5" v-model="form.email" type="email" placeholder="Entrez votre email" required></b-form-input>
            </b-form-group>
            <button type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
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
	name: 'Subscription',
	data(){
		return{
			failure:false,
			form:{
				first_name:"",
				last_name:"",
				pseudo:"",
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
		async onSubscription (event) {
			event.preventDefault();
			try {
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": "Bearer my-token"},
					body: JSON.stringify(this.form)
				};
				const response = await fetch(this.urlApi + "/users/signup", requestOptions);
				if(response.ok === true ){
					console.log(response);
					this.$router.push('connect');
					this.$store.state.successSubscribe = true;
					console.log(this.$store.state.successSubscribe);
					//event.target.reset();
				} else {
					this.failure= true;
					console.log("erreure");
				}
			} catch (error) {
				console.log(error.message);
			}
		}
	}
};



</script>


<style lang="scss" >
.form{
  text-align: left;
}
.vue-template{
  width: 75%;
  margin:auto;
  padding-top:4rem;
  }

</style>





