<template>
	<b-form class="formPwdUpdate"  >
		<b-link class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible :variant='variantResult'  @dismiss-count-down="countDownChanged" >
			{{apiResponse.message}}</b-alert></b-link>
			<b-form-group v-if="!updatePwdSuccess" style="font-weight:bold" id="input-group-5"   label="Actuel mot de passe:" label-for="input-5" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input  style="font-style:italic" id="input-5" autocomplete="section-blue current-password" v-model.trim="$v.oldPassword.$model" :class='{"is-invalid":$v.oldPassword.$error,"is-valid":!$v.oldPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
           <b-form-group  v-if="updatePwdSuccess" style="font-weight:bold" id="input-group-6"   label="Choisir un nouveau mot de passe:" label-for="input-6" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-6" autocomplete="section-blue new-password" v-model.trim="$v.newPassword.$model" :class='{"is-invalid":$v.newPassword.$error,"is-valid":!$v.newPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group>
            <b-form-group v-if="updatePwdSuccess" style="font-weight:bold" id="input-group-7"   label="Confirmez nouveau mot de passe:" label-for="input-7" description="Au moins 8 caractères, 1 majuscule, 1 chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-7" autocomplete="section-blue new-password" v-model.trim="$v.repeatNewPassword.$model" :class='{"is-invalid":$v.repeatNewPassword.$error,"is-valid":!$v.repeatNewPassword.$invalid}' type="password" placeholder="Entrez votre mot de passe"    ></b-form-input>
            </b-form-group> 
			<b-row>
				<b-col>
					<button   v-if="!updatePwdSuccess" type="submit"  @click="validPwd" class="btn btn-success btn-lg btn-block" >Changer de mot de passe</button>
					<button   v-if="newPassword === repeatNewPassword && newPassword !== null && repeatNewPassword !== null"  @click="onUpdatePwd"  class="btn btn-success btn-lg btn-block">Sauvegarder mot de passe</button>
				</b-col>
				<b-col v-if="!updatePwdSuccess">
					<button   type="submit"  @click="deleteAccount" class="btn btn-danger btn-lg btn-block" >Supprimer mon compte</button>
				</b-col>
			</b-row>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form> 
</template>
<script>
import { required,  helpers, sameAs } from 'vuelidate/lib/validators';
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
import {mapState} from 'vuex';
export default {
	name: 'FormValidateUser',
	data(){
		return{
			boxOne: '',
			boxTwo: '',
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
			repeatNewPassword:null
			
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
		...mapState([
			'urlApi',
			'successSubscribe',
			'sucessUpdateUser', 
			'deleteAccountSuccess',
			'deleteAccountRequest',
			'token',
			'isConnect',
			'userId',
			'user'])
	},
	methods:{
		async showMsgDeleteAccount() {
			this.boxOne = '';
			const modal = await this.$bvModal.msgBoxConfirm('Etes vous sur de vouloir supprimer votre compte définitivement?');
			this.boxOne = await modal;
		},
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
		bodyUpdate(){
			return {
				first_name:this.first_name === ""? this.user.first_name : this.first_name,
				last_name:this.last_name === ""? this.user.last_name : this.last_name,
				pseudo:this.pseudo === ""? this.user.pseudo : this.pseudo,
				email:this.email === ""? this.user.email : this.email,
				password:this.repeatNewPassword,
				is_admin:this.user.is_admin
			};
		},
		showAlert(apiResponse, variant) {
			this.variantResult = variant;
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
			try {
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": `Bearer ${this.token}`},
					body: JSON.stringify({
						email:this.user.email,
						password:this.oldPassword})
				};
				const response = await fetch(this.urlApi + "/users/verifypwd", requestOptions);
				const dataResponse = await response.json();
				console.log(this.dataResponse.message);
				if(response.ok === true ){
					this.updatePwdSuccess = true;
					this.showAlert({message:'Choisissez et confirmez un nouveau mot de passe!'}, "success");
				} else {
					this.showAlert(dataResponse, "danger");
				}
			} catch (error) {
				console.log(error,"erreure sur valipPwd");
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
				console.log(error,"erreure sur findOneUser");
			}
		
		},
		async onUpdatePwd (event) {
			event.preventDefault();
			try {
				if(this.oldPassword === this.newPassword){
					this.showAlert({message:"Vous avez deja ce mot de passe!!"}, "danger");
					this.updatePwdSuccess = false;
					this.newPassword = null;
					this.repeatNewPassword = null;
				} else{
					const requestOptions = {
						method: "Put",
						headers: { 
							"Content-Type": "application/json",
							"Authorization": `Bearer ${this.token}`},
						body: JSON.stringify(this.bodyUpdate())
					};
					const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
					const updateResponse = await response.json();
					if(response.ok === true ){
						this.showAlert({message:'Mot de passe modifié!'},"success");
						this.savePwd  = true;
						this.updatePwdSuccess = false;
						this.newPassword = null;
						this.repeatNewPassword = null;
						this.oldPassword = null;
						this.$v.oldPassword.$reset();
						await this.findOneUser();
					} else {
						this.showAlert(updateResponse, "danger");
					} 
				}
			} catch (error) {
				console.log(error.message);
			}
		}, 
		async deleteAccount(event){
			event.preventDefault();
			try {
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
				if(loginRequest.ok === true && this.user.is_admin == 0){
					await this.showMsgDeleteAccount();
					//const confirmResponse = confirm("Etes vous sur de vouloir supprimer définitivement votre compte?");
					if (this.boxOne) {
						const deleteRequestOptions = {
							method: "Delete",
							headers: { 
								"Content-Type": "application/json",
								"Authorization": `Bearer ${this.token}`},
						};
						const deleteRequest = await fetch(this.urlApi + `/users/${this.userId}`, deleteRequestOptions);
						const deleteAccountRequestResponse = await deleteRequest.json();
						if(deleteRequest.ok === true ){
							this.deleteAccountResponse(deleteAccountRequestResponse);
							this.deleteSuccess();
							this.isConnectInStore();
							this.$router.push('/');
						} else {
							this.showAlert(deleteAccountRequestResponse, "danger");
						}  
					} 
				} else if(this.user.is_admin == 1){
					this.showAlert({message:"Vous ne pouvez pas supprimer le compte d'un admin"}, "danger");
				} else {
					this.showAlert(loginResponse, "danger");
				}
			} catch (error) {
				console.log(error.message,"erreure sur deleteAccount");
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
.btn{
	height: 100%;
}

</style>
