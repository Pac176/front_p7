<template>
	<b-form class="formSubscribe"  @submit="onSubscription">
			<b-link class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible :variant='variantResult'  @dismiss-count-down="countDownChanged" >
			{{apiResponse.message}}</b-alert></b-link>
            <b-form-group style="font-weight:bold" id="input-group-2"  label="Votre Prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2" autocomplete="section-blue first-name" v-model.trim="$v.first_name.$model" :class='{"is-invalid":$v.first_name.$error,"is-valid":!$v.first_name.$invalid}' placeholder="Entrez votre prénom (uniquement des lettres)"  ></b-form-input>
            </b-form-group>
			<b-form-group style="font-weight:bold" id="input-group-1"   label="Votre nom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-1" autocomplete="section-blue family-name" v-model.trim="$v.last_name.$model" :class='{"is-invalid":$v.last_name.$error,"is-valid":!$v.last_name.$invalid}' placeholder="Entrez votre nom (uniquement des lettres)"  ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3" autocomplete="section-blue nickname" v-model.trim="$v.pseudo.$model" :class='{"is-invalid":$v.pseudo.$error,"is-valid":!$v.pseudo.$invalid}' placeholder="Entrez votre pseudo (uniquement des lettres)" ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" autocomplete="section-blue current-password" v-model.trim="$v.password.$model" :class='{"is-invalid":$v.password.$error,"is-valid":!$v.password.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
              <b-form-input style="font-style:italic" id="input-5" autocomplete="section-blue email" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' type="email" placeholder="Entrez votre email" ></b-form-input>
            </b-form-group>
            <button  type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
</template>
<script>
import { required,  helpers, minLength, maxLength, alpha } from 'vuelidate/lib/validators';
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
			email: null
		};
	},
	validations:{
		first_name:{
			required,
			minLength: minLength(2),
			maxLength: maxLength(50),
			alpha

		},
		last_name:{
			required,
			minLength: minLength(2),
			maxLength: maxLength(50),
			alpha
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
		...mapState([
			'urlApi',
			'successSubscribe',
			'sucessUpdateUser',
			'token',
			'isConnect',
			'userId',
			'user'
		])
	},
	methods:{
		alertHover(){
			this.dismissCountDown = true;
		},
		alertHoverOut(){
			this.dismissCountDown = 1;
		},
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
		successSubscriptionShow(response){
			this.$store.commit('SUCCESSSUBSCRIBE',response);
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
						password:this.password,
						is_admin:0,
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
						this.successSubscriptionShow(true);
						console.log(this.successSubscribe);
						this.tokenInStore(this.loginResponse.token);
						this.userIdInStore(this.loginResponse.userId);
						await this.findOneUser();
						this.isConnectInStore();
						this.$router.push('/Wall');
					} 
				} /* else if(signup.status === 500 ){
					console.log();
					this.showAlert({message: 'Verifiez vos informations'}, 'danger'); 
				} */else {
					this.showAlert(signupResponse, 'danger');
				} 
			} catch (error) {
				console.log('dfdsfdsf');
				this.showAlert({message: error},'danger');
				console.log(error);
			}
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
				console.log(error,"Erreure sur la findOneUser!");
			}
			
		},
	}};		
</script>

<style lang="scss" scoped>

.linkAlert{
	text-decoration: none;
}

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

.formValidateUser {
	display:flex;
	flex-direction: column;
	align-self: center;
}

</style>
