<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand to="/"><img id="logoHeader" src="images\icon-left-font-monochrome-white.svg" alt="Icone groupomania-left"></b-navbar-brand>
    <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
    <b-collapse id="nav-text-collapse" is-nav>
<b-navbar-nav v-if="this.$store.state.isConnect" id="connectMenu">
    <b-navbar-nav id="menuGauche">
        <b-nav-item class="routerLink" to="/wall" >Fil d'actualité</b-nav-item>
        <b-nav-item class="routerLink" to="/myAccount">Mon Compte</b-nav-item>
        <b-nav-item v-if="this.$store.state.isAdmin" class="routerLink" to="/MyAccount">Tableau de bord</b-nav-item> 
        <b-nav-item  v-if="$route.path=='/myAccount'" class="routerLink" to="/updateAccount">Modifier mes infos</b-nav-item> 
    </b-navbar-nav>
     <b-navbar-nav id="menuDroit">   
        <b-nav-item > <b-button variant="danger"  @click.stop='isConnect()'  to="/" >Deconnexion</b-button></b-nav-item>
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
export default {
	name: 'Nav',
	data(){
		return{
   
		};
	},
	methods:{
		isConnect(){
			return this.$store.state.isConnect = this.$store.state.isConnect? false: true;
		},
		
	}
 
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">




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
  width:15rem
 
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


</style>
 