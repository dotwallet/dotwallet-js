/* eslint-disable */
<template>
  <div id="app">
    <div id="login-button"></div>
    <div id="login-redirect"></div>
  </div>
</template>

<script>
import dotwallet from "dotwallet-js";
import { YOUR_SERVER_URL, YOUR_PAGE_URL, YOUR_CLIENT_ID } from "./config";
export default {
  name: "App",
  mounted() {
    console.log("dotwallet.test", dotwallet.test);
    dotwallet.login("login-button", {
      clientID: YOUR_CLIENT_ID,
      redirectURI: YOUR_PAGE_URL,
      lang: "zh",
      log: true,
    });
    dotwallet.loginRedirect({
      authEndpoint: YOUR_SERVER_URL + "auth",
      log: true,
      successCallback: (response) => {
        alert(JSON.stringify(response));
      },
      failureCallback: (error) => {
        alert(JSON.stringify(error));
      },
    });
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
