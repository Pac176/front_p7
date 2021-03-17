<template>
  <div class="myAccount">
     <Nav></Nav>
      <h1>Mon Compte</h1>
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