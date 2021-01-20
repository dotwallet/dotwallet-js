/* eslint-disable */
<template>
  <div id="app">
    <div id="login-button"></div>
  </div>
</template>

<script>
import dotwallet from "dotwallet-js";
export default {
  name: "App",
  mounted() {
    console.log(dotwallet.test);
    dotwallet.login("login-button", { clientID: "sd" });
  },
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
