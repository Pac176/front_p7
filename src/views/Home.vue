<template>
  <div class="home">
     <Nav></Nav>
     <h1>Bienvenue sur le reseau social GROUPOMANIA</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue'

export default {
  name: 'Home',
  components: {
    Nav
  }
}
</script>
