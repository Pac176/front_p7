<template>
      <div class="vue-template">
		
		<b-form class="form" @submit="onSubscription" >
			<b-alert variant="danger" v-if="this.badValidation" show>{{this.data.message}}</b-alert> 
           <b-form-group style="font-weight:bold" id="input-group-1"  label="Votre Nom:" label-for="input-1" >
              <b-form-input style="font-style:italic" id="input-1" v-model="first_name" v-model.trim="$v.first_name.$model" :class='{"is-invalid":$v.first_name.$error,"is-valid":!$v.first_name.$invalid}' placeholder="Entrez votre nom (uniquement des lettres)" required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-2"  label="Votre prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2" v-model.trim="$v.last_name.$model" :class='{"is-invalid":$v.last_name.$error,"is-valid":!$v.last_name.$invalid}' placeholder="Entrez votre prénom (uniquement des lettres)" required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3" v-model.trim="$v.pseudo.$model" :class='{"is-invalid":$v.pseudo.$error,"is-valid":!$v.pseudo.$invalid}' placeholder="Entrez votre pseudo (uniquement des lettres)" ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" v-model.trim="$v.password.$model" :class='{"is-invalid":$v.password.$error,"is-valid":!$v.password.$invalid}' type="password" placeholder="Entrez votre mot de passe"   required ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
              <b-form-input style="font-style:italic" id="input-5" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' type="email" placeholder="Entrez votre email" required></b-form-input>
            </b-form-group>
            <button type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
            <p class="forgot-password text-right mt-2 mb-4">
            <router-link to="/motDePasseOublie">Mot de passe oublié ?</router-link>
            </p>
       </b-form>
    </div>

</template>
<script>
// @ is an alias to /src
import { required,  helpers, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
export default {
	name: 'Subscription',
	data(){
		return{
			data:{},
			badValidation:false,
			first_name:"",
			last_name:"",
			pseudo:"",
			password:"",
			email:"",
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	validations:{
		first_name:{
			required,
			minLength: minLength(2),
			maxLength: maxLength(50),
			alphaNum

		},
		last_name:{
			required,
			minLength: minLength(2),
			maxLength: maxLength(50),
			alphaNum
		},
		pseudo:{
			minLength: minLength(2),
			maxLength: maxLength(50),
			alphaNum
		}, 
		email:{
			required,
			emailRegex
		},
		password:{
			required,
			pwdRegex
		}
	
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
					body: JSON.stringify({
						first_name:this.first_name,
						last_name:this.last_name,
						pseudo:this.pseudo,
						email:this.email,
						password:this.password
					})
				};
				const response = await fetch(this.urlApi + "/users/signup", requestOptions);
				this.data = await response.json();
				
				if(response.ok === true ){
					console.log(response);
					this.$router.push('/Wall');
					this.$store.state.successSubscribe = true;
					const ConnectRequestOptions = {
						method: "POST",
						headers: { 
							"Content-Type": "application/json",
							"Authorization": "Bearer my-token"},
						body: JSON.stringify({
							email:this.email,
							password:this.password})
					};	

					const response = await fetch(this.urlApi + "/users/login", ConnectRequestOptions);
					this.data = await response.json();
					console.log(this.$store.state.token);
					this.$store.state.token = this.data.token;
					this.$store.state.isConnect = true;
					console.log(this.$store.state.successSubscribe);
					
				} else {
					this.badValidation = true;
				} 
			} catch (error) {
				console.log(error.message);
			}
	
		
		}}};		
				
				
				
		


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
