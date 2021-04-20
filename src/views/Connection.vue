<template>
  <div class="connect">
   <Nav></Nav>
	<div class="vue-template">
        <b-form class="formConnect" @submit="onConnect">
			<b-alert :show="dismissCountDown" dismissible  :variant="variantResult"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     {{this.dataResponse.message}}
    </b-alert>
		<b-form-group style="font-weight:bold" id="input-group-1"  label="Modifier votre adresse Email:" label-for="input-1"  description="Sous la forme xxxx@xxxxx.xxxx">
            <b-form-input style="font-style:italic" id="input-1"  type="email" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' placeholder="Entrez votre email"  ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-2"   label="Mot de passe:" label-for="input-2" description="Au moins 8 caractères, 1 majuscule, 1chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-2" type="password" v-model.trim="$v.password.$model" :class='{"is-invalid":$v.password.$error,"is-valid":!$v.password.$invalid}' placeholder="Entrez votre mot de passe"   required ></b-form-input>
            </b-form-group>
            <button type="submit"   class="btn btn-success btn-lg btn-block" to="/wall">Connexion</button>
            <p class="forgot-password text-right mt-2 mb-4">
            <!-- <router-link to="/motDePasseOublie">Mot de passe oublié ?</router-link> -->
            </p>
       </b-form>
    </div>
  </div>
</template>

<script>

import Nav from '@/components/Nav.vue';
import { required,  helpers } from 'vuelidate/lib/validators';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
import {mapState} from 'vuex';
export default {
	name: 'Connect',
	data(){
		return{
			password:"",
			email: "",
			variantResult:"",
			dismissSecs: 5,
			dismissCountDown: 0,
			dataResponse:{},
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	validations:{
		email:{
			required,
			emailRegex
		},
		password:{
			required,
			pwdRegex
		}
	
	},
	components: {
		Nav
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','user'])
	},
	methods:{
		isConnectInStore(){
			this.$store.commit('ISCONNECT');
		},
		tokenInStore(responseToken){
			this.$store.commit('TOKEN', responseToken);
		},
		userIdInStore(responseUserId){
			this.$store.commit('USERID', responseUserId);
		}, 
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert(variant) {
			this.variantResult = variant;
			this.dismissCountDown = this.dismissSecs;
		},
		userInStore(userData){
			this.$store.commit('USER',userData);
		},
		async findOneUser () {
			try {
				const requestOptions = {
					method: "Get",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
				this.userData = await response.json();
				this.userInStore(this.userData.data); 
			} catch (error) {
				console.log(error,  "Erreure sur la fonction findOneUser");
			}
		},
		async onConnect (event) {
			try {
				event.preventDefault();
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": "Bearer my-token"},
					body: JSON.stringify({
						email:this.email,
						password: this.password
					})
				};
				const response = await fetch(this.urlApi + "/users/login", requestOptions);
				const dataResponse = await response.json();
				this.dataResponse = dataResponse;
				if (response.ok === true ){
					this.isConnectInStore();
					this.tokenInStore(this.dataResponse.token);
					this.userIdInStore(this.dataResponse.userId);
					await this.findOneUser();
					this.$router.push('/wall');
					
				} else {
					this.showAlert('danger');
				}
			} catch (error) {
				console.log(error,  "Erreure sur la fonction onConnect");
			}
		}
	}
};
</script>

<style lang="scss" >
@media screen and (max-width:700px) {
	.formConnect{
	display:flex;
	flex-direction: column;
	width:95%
	}
}
@media screen and (min-width:700px) {
	.formConnect{
	width:50%
	}

}
.connect{
	margin-top:5rem
}
.vue-template{
	display: flex;
	margin:0;
	text-align: left;
	justify-content: center;
	padding-top: 4rem;
  }

</style>
