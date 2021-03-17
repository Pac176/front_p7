<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
 

  a {
    font-weight: bold;
    color: #fafbfc;

    &.router-link-exact-active {
      color: #d64f4f;
    }
  }
}
</style>
