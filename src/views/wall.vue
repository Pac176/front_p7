<template>
  <div class="wall">
     <Nav></Nav>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '@/components/Nav.vue';

export default {
	name: 'wall',
	components: {
		Nav
	}
};
</script>
