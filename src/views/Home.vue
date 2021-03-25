<template>
  <div class="home">
     <Nav></Nav><br><br><br><br>
     <h1>Bienvenue sur le reseau social de l'entreprise</h1>
      <img id="homeLogo" src="https://res.cloudinary.com/dvtklgrcu/image/upload/v1616663942/icon-above-font_hzocsv.svg" alt="logo">
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