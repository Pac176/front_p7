<template>
	<b-form class="formSubscribe"  @submit="onSubscription">
			<b-alert :show="dismissCountDown" dismissible :variant='variantResult'   @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
    {{apiResponse.message}}</b-alert>
			<b-form-group style="font-weight:bold" id="input-group-1"   label="Votre nom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-1" v-model.trim="$v.first_name.$model" :class='{"is-invalid":$v.first_name.$error,"is-valid":!$v.first_name.$invalid}' placeholder="Entrez votre nom (uniquement des lettres)"  ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-2"  label="Votre prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2" v-model.trim="$v.last_name.$model" :class='{"is-invalid":$v.last_name.$error,"is-valid":!$v.last_name.$invalid}' placeholder="Entrez votre prénom (uniquement des lettres)"  ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3" v-model.trim="$v.pseudo.$model" :class='{"is-invalid":$v.pseudo.$error,"is-valid":!$v.pseudo.$invalid}' placeholder="Entrez votre pseudo (uniquement des lettres)" ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" v-model.trim="$v.password.$model" :class='{"is-invalid":$v.password.$error,"is-valid":!$v.password.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
              <b-form-input style="font-style:italic" id="input-5" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' type="email" placeholder="Entrez votre email" ></b-form-input>
            </b-form-group>
            <button  type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
</template>
<script>
import { required,  helpers, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators';
import {mapState} from 'vuex';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
export default {
	name: 'FormValidateUser',
	data(){
		return{
			updateUser:true,
			dismissSecs: 5,
			dismissCountDown: 0,
			apiResponse:{},
			variantResult:"",
			updateResponse:{},
			badValidation:false,
			first_name: null, 
			last_name:null, 
			pseudo: null,
			password:null,
			email: null, 
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
			required,
			minLength: minLength(2),
			maxLength: maxLength(50),
			
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
	computed:{
		...mapState(['successSubscribe','sucessUpdateUser','token','isConnect','userId','user'])
	},
	methods:{

		isConnectInStore(){
			this.$store.commit('ISCONNECT');
		},
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
		showAlert(apiResponse, variant) {
			this.variantResult = variant;
			this.apiResponse = apiResponse;
			this.dismissCountDown = this.dismissSecs;
		
		},
		successSubscriptionShow(){
			this.$store.commit('SUCCESSSUBSCIBE');
		},
		tokenInStore(responseToken){
			this.$store.commit('TOKEN', responseToken);
		},
		userIdInStore(responseUserId){
			this.$store.commit('USERID', responseUserId);
		},
		userInStore(userData){
			this.$store.commit('USER',userData);
		},
		async onSubscription (event) {
			event.preventDefault();
			try {
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						first_name:this.first_name,
						last_name:this.last_name,
						pseudo:this.pseudo,
						email:this.email,
						password:this.password
					})
				};
				const signup = await fetch(this.urlApi + "/users/signup", requestOptions);
				const signupResponse= await signup.json();
				if(signup.ok === true ){
					const ConnectRequestOptions = {
						method: "POST",
						headers: { 
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email:this.email,
							password:this.password})
					};	
					const login = await fetch(this.urlApi + "/users/login", ConnectRequestOptions);
					this.loginResponse = await login.json();
					if (login.ok === true) {
						this.tokenInStore(this.loginResponse.token);
						this.userIdInStore(this.loginResponse.userId);
						await this.findOneUser();
						this.$router.push('/Wall');
						this.successSubscriptionShow();
						this.isConnectInStore();
					} 
				} else {
					this.showAlert(signupResponse, 'danger');
				} 
			} catch (error) {
				this.showAlert({message: error},'danger');
			}
		},
		async findOneUser () {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
			this.userData = await response.json();
			this.userInStore(this.userData.data);
		},
		async onUpdateUser (event) {
			event.preventDefault();
			try {
				const requestOptions = {
					method: "Put",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
					body: JSON.stringify({
						first_name:this.first_name,
						last_name:this.last_name,
						pseudo:this.pseudo,
						email:this.email,
						
						
					})
				};
				const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
				const updateResponse = await response.json();
				if(response.ok === true ){
					await this.findOneUser();
					this.updateUser = true;
					this.showAlert(updateResponse, 'success');
					
				} else {
					this.updateUser = false;
					this.showAlert(updateResponse, 'danger');
				} 
			} catch (error) {
				console.log(error.message);
			}
		}
		
	}};		
				
				
				
		


</script>

<style lang="scss">

@media screen and (max-width:700px) {
	.formSubscribe{
	display:flex;
	flex-direction: column;
	width:95%;
	display: flex;
	margin:0;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
	color: red;
    }
}
@media screen and (min-width:700px) {
	.formSubscribe{
	width:50%;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
	color: rgb(50, 59, 100);
    }
}


</style>
