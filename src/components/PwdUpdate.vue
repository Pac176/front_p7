<template>
<!-- <b-form  class="vue-template"> -->
	<b-form class="formPwdUpdate"  >
			<b-link  class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible :variant='variantResult'  @dismiss-count-down="countDownChanged" >
      {{apiResponse.message}}
    </b-alert></b-link>
			<b-form-group v-if="!updatePwdSuccess" style="font-weight:bold" id="input-group-1"   label="Actuel mot de passe:" label-for="input-1" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input  style="font-style:italic" id="input-1" v-model.trim="$v.oldPassword.$model" :class='{"is-invalid":$v.oldPassword.$error,"is-valid":!$v.oldPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
           <b-form-group  v-if="updatePwdSuccess" style="font-weight:bold" id="input-group-2"   label="Choisir un nouveau mot de passe:" label-for="input-2" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-2" v-model.trim="$v.newPassword.$model" :class='{"is-invalid":$v.newPassword.$error,"is-valid":!$v.newPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
            <b-form-group v-if="updatePwdSuccess" style="font-weight:bold" id="input-group-1"   label="Confirmez nouveau mot de passe:" label-for="input-3" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-3" v-model.trim="$v.repeatNewPassword.$model" :class='{"is-invalid":$v.repeatNewPassword.$error,"is-valid":!$v.repeatNewPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group> 
			<b-row>
				<b-col>
					<button   v-if="!updatePwdSuccess" type="submit"  @click="validPwd" class="btn btn-success btn-lg btn-block" >Changer de mot de passe</button>
				</b-col>
				<b-col>
					<button  type="submit"  @click="deleteAccount" class="btn btn-danger btn-lg btn-block" >Supprimer mon compte</button>
				</b-col>
			</b-row>
            <button   v-if="newPassword === repeatNewPassword && newPassword !== null && repeatNewPassword !== null"  @click="onUpdateUser"  class="btn btn-success btn-lg btn-block">Sauvegarder mot de passe</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form> 
	<!-- </b-form>	 -->   
   

</template>
<script>
// @ is an alias to /src
import { required,  helpers, sameAs } from 'vuelidate/lib/validators';
//const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
import {mapState} from 'vuex';
export default {
	name: 'FormValidateUser',
	data(){
		return{
			updateUser:true,
			updatePwdSuccess:false,
			savePwd:false,
			dataResponse:{},
			updateResponse:{},
			variantResult:"",
			dismissSecs: 5,
			dismissCountDown: 0,
			apiResponse:{},
			first_name: "", 
			last_name:"", 
			pseudo: "",
			email: "",
			badValidation:false,
			oldPassword:null,
			newPassword:null,
			repeatNewPassword:null,
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	validations:{
		oldPassword:{
			required,
			pwdRegex
		},
		newPassword:{
			required,
			pwdRegex 
		},
		repeatNewPassword:{
			sameAsNewPassword: sameAs('newPassword'),
			required,
			pwdRegex 
		},
	
	},
	computed:{
		...mapState(['successSubscribe','sucessUpdateUser', 'deleteAccountSuccess','deleteAccountRequest','token','isConnect','userId','user'])
	},
	methods:{
		alertHover(){
			this.dismissCountDown = true;
		},
		alertHoverOut(){
			this.dismissCountDown = 1;
		},
		userInStore(userData){
			this.$store.commit('USER',userData);
		},
		countDownChanged(dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},

		showAlert(apiResponse, variant) {
			this.variantResult = variant;
			console.log(apiResponse);
			this.apiResponse = apiResponse;
			this.dismissCountDown = this.dismissSecs;
		
		},
		isConnectInStore(){
			this.$store.commit('ISCONNECT');
		},
		deleteAccountResponse(data){
			this.$store.commit('DELETEACCOUNT', data);
		},
		deleteSuccess(){
			this.$store.commit('DELETESUCCESS');
		},
		async validPwd (event) {
			event.preventDefault();
			const requestOptions = {
				method: "POST",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body: JSON.stringify({
					email:this.user.email,
					password:this.oldPassword})
			};
			const response = await fetch(this.urlApi + "/users/login", requestOptions);
			const dataResponse = await response.json();
			console.log(this.dataResponse.message);
			if(response.ok === true ){
				this.updatePwdSuccess = true;
				this.showAlert(dataResponse, "success");
			} else {
				this.showAlert(dataResponse, "danger");
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
						
						first_name:this.first_name === ""? this.user.first_name : this.first_name,
						last_name:this.last_name === ""? this.user.last_name : this.last_name,
						pseudo:this.pseudo === ""? this.user.pseudo : this.pseudo,
						email:this.email === ""? this.user.email : this.email,
						password:this.repeatNewPassword 
					})
				};
				const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
				const updateResponse = await response.json();
				if(response.ok === true ){
					await this.findOneUser();
					
					this.savePwd  = true;
					this.showAlert(updateResponse,"success");
					
				} else {
					
					this.showAlert(updateResponse, "danger");
				} 
			} catch (error) {
				console.log(error.message);
			}
		},
		async deleteAccount(event){
			event.preventDefault();
			const requestOptions = {
				method: "POST",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`},
				body: JSON.stringify({
					email:this.user.email,
					password:this.oldPassword})
			};
			const loginRequest = await fetch(this.urlApi + "/users/login", requestOptions);
			const loginResponse = await loginRequest.json();	
			if(loginRequest.ok === true ){
				const deleteRequestOptions = {
					method: "Delete",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
				};
				const deleteRequest = await fetch(this.urlApi + `/users/${this.userId}`, deleteRequestOptions);
				const deleteAccountRequestResponse = await deleteRequest.json();
				if(deleteRequest.ok === true ){
					confirm("Etes vous sur de vouloir supprimer définitivement votre compte?");
					console.log(deleteAccountRequestResponse.message);
					this.deleteAccountResponse(deleteAccountRequestResponse);
					this.deleteSuccess();
					console.log(this.deleteAccountSuccess);
					console.log(this.deleteAccountRequest);
					this.isConnectInStore();
					this.$router.push('/');
									
				} else {
					this.showAlert(deleteAccountRequestResponse, "danger");
				}  
			} else {
				this.showAlert(loginResponse, "danger");
			}
		},
	}};		
				
				
				
		


</script>

<style lang="scss" scoped>

@media screen and (max-width:500px) {
	.formPwdUpdate{
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
@media screen and (min-width:500px) {
	.formPwdUpdate{
	width:95%;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
	
    }
}
.linkAlert{
	text-decoration: none;
}
/* .vue-template{
	display: flex;
	margin:0;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
  } */
</style>
