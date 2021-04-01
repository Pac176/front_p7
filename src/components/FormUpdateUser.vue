<template>
	<b-form class="formUpdate"  @submit="onUpdateUser">
		<b-link  v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour maintenir le message'" :show="dismissCountDown" dismissible  :variant='updateUser ? "success":"danger"'  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged" id='alert'>
    {{this.updateResponse.message}}</b-alert></b-link>
           <b-form-group style="font-weight:bold" id="input-group-1"  label="Modifier votre Nom:"  Nom: label-for="input-1" >
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
            <button   type="submit"   class="btn btn-success btn-lg btn-block">Modifier mes donnees</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
	
</template>

<script>
// @ is an alias to /src


import {mapState} from 'vuex';
import { required,  helpers, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

export default {
  
	name: 'FormUpdateUser',
	data(){
		return{
			updateResponse:{},
			updateUser:true,
			dismissSecs: 5,
			dismissCountDown: 0,
			first_name: this.$store.state.user.first_name, 
			last_name:this.$store.state.user.last_name, 
			pseudo: this.$store.state.user.pseudo,
			password:null,
			email: this.$store.state.user.email,
			userData:{},
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	components: {
	
		
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
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
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
		showAlert(apiResponse) {
			this.apiResponse = apiResponse;
			this.dismissCountDown = this.dismissSecs;
		
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
	},
	mounted(){
		this.findOneUser();
	
		
	}
};
</script>

<style lang="scss" scoped>

@media screen and (max-width:500px) {
	.formUpdate{
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
@media screen and (min-width:500px) {
	.formUpdate{
	width:95%;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
	color: rgb(50, 59, 100);
    }
}
.btn-outline{
	width:100%;
	height: 100%;
}
/* .vue-template{
	display: flex;
	margin:0;
	text-align: left;
	justify-content: center;
	padding-top: 2rem;
  } */
</style>
