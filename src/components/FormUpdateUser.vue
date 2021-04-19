<template>
	<b-form class="formUpdate"  @submit="onUpdateUser">
		<b-link  class='linkAlert' v-on:mouseover="alertHover" v-on:mouseleave="alertHoverOut"><b-alert v-b-tooltip.bottom.v-info="'Garder la souris ici pour conserver le message'" :show="dismissCountDown" dismissible  :variant='variantResult'  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged" id='alert'>
    {{apiResponse.message}}</b-alert></b-link>
           <b-form-group style="font-weight:bold" id="input-group-1"  label="Modifier votre Nom:"  label-for="input-1" > 
              <b-form-input  style="font-style:italic" id="input-1" v-model.trim="$v.first_name.$model" :class='{"is-invalid":$v.first_name.$error,"is-valid":!$v.first_name.$invalid}' :placeholder="user.first_name"   ></b-form-input>
            </b-form-group>
           <b-form-group style="font-weight:bold" id="input-group-2"  label="Modifier votre prénom:" label-for="input-2" >
              <b-form-input style="font-style:italic" id="input-2"   v-model.trim="$v.last_name.$model" :class='{"is-invalid":$v.last_name.$error,"is-valid":!$v.last_name.$invalid}' :placeholder="user.last_name"   ></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-3"  label="Modifier votre pseudo:" label-for="input-3" >
              <b-form-input style="font-style:italic" id="input-3"  v-model.trim="$v.pseudo.$model" :class='{"is-invalid":$v.pseudo.$error,"is-valid":!$v.pseudo.$invalid}'  :placeholder="user.pseudo" ></b-form-input>
            </b-form-group> 
            <b-form-group style="font-weight:bold" id="input-group-5"  label="Modifier votre adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
            <b-form-input style="font-style:italic" id="input-5"  type="email" v-model.trim="$v.email.$model" :class='{"is-invalid":$v.email.$error,"is-valid":!$v.email.$invalid}' :placeholder="user.email"  ></b-form-input>
            </b-form-group> 
            <button   type="submit"   class="btn btn-success btn-lg btn-block">Modifier mes donnees</button>
            <p class="forgot-password text-right mt-2 mb-4">
            </p>
       </b-form>
</template>

<script>
import {mapState} from 'vuex';
import { required,  helpers, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators';
const emailRegex = helpers.regex('emailRegex', /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,6}$/);
const pwdRegex = helpers.regex('pwdRegex', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

export default {
	name: 'FormUpdateUser',
	data(){
		return{
			apiResponse:{},
			variantResult:"",
			updateResponse:{},
			updateUser:true,
			dismissSecs: 5,
			dismissCountDown: 0,
			first_name: "", 
			last_name:"", 
			pseudo: "",
			password:"",
			email: "",
			userData:{},
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
		showAlert(apiResponse, variant) {
			this.variantResult = variant;
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
						first_name:this.first_name === ""? this.user.first_name : this.first_name,
						last_name:this.last_name === ""? this.user.last_name : this.last_name,
						pseudo:this.pseudo === ""? this.user.pseudo : this.pseudo,
						email:this.email === ""? this.user.email : this.email,
						password: this.user.password 
					})
				};
				const response = await fetch(this.urlApi + `/users/${this.userId}`, requestOptions);
				const updateResponse = await response.json();
				if(response.ok === true ){
					await this.findOneUser();
					this.updateUser = true;
					if(this.first_name === "" && this.last_name === ""  &&	this.pseudo === "" && this.email === "" &&	this.password === "" ){
						this.showAlert(updateResponse,'warning');
					} else {
						this.updateUser = false;
						this.showAlert(updateResponse,'success');
					} 
				} else {
					this.updateUser = false;
					this.showAlert(updateResponse,'danger');
				}
			} catch (error) {
				console.log('erreure');
				this.showAlert({message: error},'danger');
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
.linkAlert{
	text-decoration: none;
}
</style>
