<template>
      <div >
		<b-form v-if="!isConnect" class="vue-template">
			<b-form class="form"  @submit="onSubscription">
			<b-alert :show="dismissCountDown" dismissible variant=""   @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     {{this.dataResponse.message}}</b-alert>
			<b-form-group style="font-weight:bold" id="input-group-1"  label1="Votre Nom:" label-for="input-1" >
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
            <button v-if="$route.path=='/Subscription'" type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
            <button v-if="$route.path=='/myAccount/*'" type="submit"   class="btn btn-success btn-lg btn-block">Modifier mes donnees</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
		</b-form>
		<b-form v-else class="vue-template">
				<b-form class="form"  @submit="onUpdateUser">
			<b-alert :show="dismissCountDown" dismissible  :variant='updateUser ? "success":"danger"'  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged" id='alert'>
     {{this.dataResponse.message}}</b-alert>
           <b-form-group style="font-weight:bold" id="input-group-1"  label="Moifier votre Nom:"  Nom: label-for="input-1" >
              <b-form-input  style="font-style:italic" id="input-1" v-model.trim="$v.first_name.$model" :class='{"is-invalid":$v.first_name.$error,"is-valid":!$v.first_name.$invalid}'  :placeHolder="$store.state.user.first_name"  ></b-form-input>
            </b-form-group>
           <b-form-group style="font-weight:bold" id="input-group-2"  label="Modifier votre prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2"   v-model.trim="$v.last_name.$model" :class='{"is-invalid":$v.last_name.$error,"is-valid":!$v.last_name.$invalid}' :placeHolder="user.last_name"   ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Modifier votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3"  v-model.trim="$v.pseudo.$model" :class='{"is-invalid":$v.pseudo.$error,"is-valid":!$v.pseudo.$invalid}' :placeHolder="user.pseudo"  ></b-form-input>
            </b-form-group> 
           <!-- <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4"  type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>  -->
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Modifier votre adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
              <b-form-input style="font-style:italic" id="input-5"  type="email" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' :placeHolder="user.email"  ></b-form-input>
            </b-form-group> 
            <button v-if="!isConnect" type="submit"   class="btn btn-success btn-lg btn-block">Inscription</button>
            <button v-if="isConnect" type="submit"   class="btn btn-success btn-lg btn-block">Modifier mes donnees</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
			</b-form> 
    </div>

</template>
<script>
// @ is an alias to /src
import { required,  helpers, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
import {mapState} from 'vuex';
export default {
	name: 'Subscription',
	data(){
		return{
			updateUser:true,
			dismissSecs: 30,
			dismissCountDown: 0,
			dataResponse:{},
			badValidation:false,
			first_name:this.$store.state.user.first_name,
			last_name:this.$store.state.user.last_name,
			pseudo:this.$store.state.user.pseudo,
			password:"",
			email:this.$store.state.user.email,
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
		showAlert() {
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
		async findOneUser () {
			const requestOptions = {
				method: "Get",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
			};
			const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
			this.userData = await response.json();
			this.userInStore(this.userData.data) ;
			
		
		},
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
				this.dataResponse = await response.json();
				if(response.ok === true ){
					this.$router.push('/Wall');
					this.successSubscriptionShow();
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
					this.dataResponse = await response.json();
					this.isConnectInStore();
					this.tokenInStore(this.dataResponse.token);
					this.userIdInStore(this.dataResponse.userId);
					
				} else {
					this.showAlert();
				} 
			} catch (error) {
				console.log(error.message);
			}
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
				this.dataResponse = await response.json();
				if(response.ok === true ){
					this.findOneUser();
					this.updateUser = true;
					this.showAlert();
				} else {
					this.updateUser = false;
					this.showAlert();
				} 
			} catch (error) {
				console.log(error.message);
			}
		}
		
	}};		
				
				
				
		


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
