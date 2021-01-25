/* eslint-disable */
<template>
  <div id="app">
    <p>login</p>
    <div id="login-button"></div>
    <div id="login-redirect"></div>
    <p>order pay</p>
    <div id="pay-button"></div>
  </div>
</template>

<script>
import dotwallet from "dotwallet-js";
import {
  YOUR_SERVER_URL,
  YOUR_PAGE_URL,
  YOUR_CLIENT_ID,
  DEV_WALLET_ADDRESS,
} from "./config";
export default {
  name: "App",
  mounted() {
    console.log("dotwallet.test", dotwallet.test);
    dotwallet.loginButton("login-button", {
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
    dotwallet.payButton("pay-button", {
      productName: "Bananas",
      orderAmount: 900,
      receiveAddress: DEV_WALLET_ADDRESS,
      createOrderEndpoint: YOUR_SERVER_URL + "create-order",
      redirectURI: YOUR_PAGE_URL,
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
