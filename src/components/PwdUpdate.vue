<template>
<b-form  class="vue-template">
	<b-form class="form"  @submit="onSubscription">
			<b-alert :show="dismissCountDown" dismissible :variant='successSubscribe ? "success":"danger"'   @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
    {{this.apiResponse.message}}</b-alert>
			
            
           
            <b-form-group style="font-weight:bold" id="input-group-1"   label="Actuel mot de passe:" label-for="input-1" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-1" v-model.trim="$v.oldPassword.$model" :class='{"is-invalid":$v.oldPassword.$error,"is-valid":!$v.oldPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
           <b-form-group style="font-weight:bold" id="input-group-2"   label="Actuel mot de passe:" label-for="input-2" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-2" v-model.trim="$v.newPassword1.$model" :class='{"is-invalid":$v.newPassword1.$error,"is-valid":!$v.newPassword1.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-1"   label="Actuel mot de passe:" label-for="input-3" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-3" v-model.trim="$v.newPassword2.$model" :class='{"is-invalid":$v.newPassword2.$error,"is-valid":!$v.newPassword2.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group> 
          
            <button  type="submit"   class="btn btn-success btn-lg btn-block">Changer de mot de passe</button>
            
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
	</b-form>	   
   

</template>
<script>
// @ is an alias to /src
import { required,  helpers } from 'vuelidate/lib/validators';
//const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
import {mapState} from 'vuex';
export default {
	name: 'FormValidateUser',
	data(){
		return{
			updateUser:true,
			dismissSecs: 5,
			dismissCountDown: 0,
			apiResponse:{},
			updateResponse:{},
			badValidation:false,
			oldPassword:null,
			newPassword1:null,
			newPassword:null,
			email: this.$store.state.user.email, 
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	validations:{
		oldPassword:{
			required,
			pwdRegex
		},
		newPassword1:{
			required,
			pwdRegex
		},
		newPassword2:{
			required,
			pwdRegex
		},
	
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
		showAlert(apiResponse) {
			console.log(apiResponse);
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
			console.log(this.$store.state.userId);
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
					console.log('coucou Kévin');
					this.showAlert(signupResponse);
				} 
			} catch (error) {
				console.log('coucou pascal');
				this.showAlert({message: error});
			}
		},
		async findOneUser () {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			console.log(this.userId);
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
				this.updateResponse = await response.json();
				if(response.ok === true ){
					await this.findOneUser();
					this.updateUser = true;
					this.showAlert();
					
				} else {
					console.log("ko");
					this.updateUser = false;
					this.showAlert();
				} 
			} catch (error) {
				
				console.log(error.message);
			}
		}
		
	}};		
				
				
				
		


</script>

<style lang="scss">

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
	padding-top: 2rem;
  }
</style>
