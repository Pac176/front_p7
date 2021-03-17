<template>
<nav id='nav'>

  <router-link class="navLink" to="/"><img id="logoHeader" src="images\icon-left-font-monochrome-white.svg" alt="Icone groupomania-left"> </router-link> 
  <router-link class="navLink" to="/Connect">Connexion</router-link>
  <router-link class="navLink" to="/Subscription">Inscription</router-link>
  <router-link class="navLink" to="/MyAccount">Mon Compte</router-link>
  <router-link class="navLink" to="/Connect">Deconnexion</router-link>
 </nav>

</template>

<script>
export default {
  name: 'Nav',
  props: {
    msg: String
  }
}
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
.navLink{
  color:rgb(253, 251, 251);
  font-size: 1.5rem;
  margin-left: 1rem;
  text-decoration-line: none;
}
</style>
