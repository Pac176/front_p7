<template>
  <div class="connect">
   <Nav></Nav>
	<div class="vue-template">
        <b-form class="formConnect" @submit="onConnect">
			<b-alert :show="dismissCountDown" dismissible  :variant="variantResult"  @dismissed="dismissCountDown=0"  @dismiss-count-down="countDownChanged">
     {{this.dataResponse.message}}
    </b-alert>
		<b-form-group style="font-weight:bold" id="input-group-5"  label="Adresse Email:" label-for="input-5"  description="Sous la forme xxxx@xxxxx.xxxx">
            <b-form-input style="font-style:italic" id="input-5" v-model="form.email" type="email" placeholder="Entrez votre email" required></b-form-input>
            </b-form-group>
            <b-form-group style="font-weight:bold" id="input-group-4"   label="Mot de passe:" label-for="input-4" description="Au moins 8 caractères, 1 majuscule, 1chiffre et un caratere special" >
              <b-form-input style="font-style:italic" id="input-4" v-model="form.password" type="password" placeholder="Entrez votre mot de passe"   required ></b-form-input>
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
// @ is an alias to /src
import Nav from '@/components/Nav.vue';
import {mapState} from 'vuex';
export default {
	name: 'Connect',
	data(){
		return{
			variantResult:"",
			dismissSecs: 5,
			dismissCountDown: 0,
			dataResponse:{},
			form:{
				password:"",
				email:""
			},
			urlApi:'http://localhost:3000/api/groupomania',
		};
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
		async onConnect (event) {
			try {
				
				event.preventDefault();
				const requestOptions = {
					method: "POST",
					headers: { 
						"Content-Type": "application/json",
						"Authorization": "Bearer my-token"},
					body: JSON.stringify(this.form)
				};
				const response = await fetch(this.urlApi + "/users/login", requestOptions);
				const dataResponse = await response.json();
				this.dataResponse = dataResponse;
				if(response.ok === true ){
					this.isConnectInStore();
					this.tokenInStore(this.dataResponse.token);
					this.userIdInStore(this.dataResponse.userId);
					await this.findOneUser();
					console.log(this.user);
					this.$router.push('/wall');
					
				}else{
					this.showAlert('danger');
				}
  
			} catch (e) {
				console.log(e);
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
