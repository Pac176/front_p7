<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark" class="fixed-top">
    <b-navbar-brand to="/"><img id="logoHeader" src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616663944/icon-left-font-monochrome-white_pgqzj3.svg" alt="Icone groupomania-left"></b-navbar-brand>
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
    <b-collapse id="nav-text-collapse" is-nav>
<b-navbar-nav v-if="isConnect" id="connectMenu">
    <b-navbar-nav id="menuGauche">
        <b-nav-item class="routerLink" to="/wall" >Fil d'actualité</b-nav-item>
        <b-nav-item class="routerLink" to='/myAccount/user' >Mon Compte</b-nav-item>
        <b-nav-item  v-if="user.is_admin" class="routerLink" to="/MyAccount">Tableau de bord</b-nav-item> 
        
    </b-navbar-nav>
     <b-navbar-nav id="menuDroit">   
        <b-nav-item > <b-button variant="danger"  @click.stop='isConnectInStore'  to="/" >Deconnexion</b-button></b-nav-item>
    </b-navbar-nav>
</b-navbar-nav>
       <b-navbar-nav v-else>  
        <b-nav-item class="routerLink" to="/Subscription" >Inscription</b-nav-item>
        <b-nav-item  class="routerLink"  to="/Connect">Connexion</b-nav-item> 
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  
</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
	name: 'Nav',
	data(){
		return{
			userData:{},
			urlApi:'http://localhost:3000/api/groupomania',
		};
	},
	computed:{
		...mapState(['successSubscribe','token','isConnect','userId','isAdmin','user'])
	},
	methods:{
		isConnectInStore(){
			this.$store.commit('ISCONNECT');
			
		},
	}
 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


.fixed-top{
  font-size:0.5rem;
  color:red
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

#logoHeader {
  width:10rem
 
}
#nav{
display: flex;
flex-direction: row;
align-items: center;
height: 8rem;

background-color: #454545;
} 
 .nav-link{
  color:red;
  font-size: 2rem;
  margin-left: 1rem;
  text-decoration-line: none;
  
}
@media screen and (min-width:992px) {
  #connectMenu{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  width:100%;
}
#menuGauche{
display:flex
}
#menuDroit{
display:flex
}
}
.navbar-dark .navbar-nav .nav-link {
   font-size:1.5rem;
   color:rgb(199, 197, 197);
}

.navbar-dark:hover .navbar-nav:hover .nav-link:hover {
  color:rgb(231, 146, 146);}

</style>
 