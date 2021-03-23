<template>
  <div class="home">
     <Nav></Nav><br><br><br><br>
     <h1>Bienvenue sur le reseau social de l'entreprise GROUPOMANIA</h1>
      <img id="homeLogo" src="images/icon-left-font.svg" alt="logo">
     </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';

export default {
	name: 'Home',
	components: {
		Nav
	}
};
</script>

<style lang="scss" scoped>
h1 {
  color:red;
}
#homeLogo {
  width:50%;
}
</style>