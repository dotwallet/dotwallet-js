# dotwallet-js

Quickly add DotWallet functionality to your JavaScript front-end application or website.

Includes:

- A login button and hidden element to handle login redirects
- A payments button
- An 'Automatic Payments' button (can also be invisible and called programmatically)

## To use

```js
// In script tag:
<script src="https://unpkg.com/@dotwallet/js/dist/dotwallet.umd.js"></script>

// As import
npm i @dotwallet/js

// ---login---
// set up a div with any id <div id="login-button"> and pass it to this function
dotwallet.loginButton("login-button", {
    clientID: YOUR_CLIENT_ID,
    redirectURI: YOUR_PAGE_URL, // loginRedirect must be running in this URL
});
// accept the login `code` and request user_token and user info
dotwallet.loginRedirect({
    authEndpoint: YOUR_SERVER_URL_AUTH_ENDPOINT,
    successCallback: (data) => {
    // do something with the data, e.g. save in localStorage.
    },
});

// ---payments---
// set up a div with any id <div id="pay-button"> and pass it to this function
dotwallet.payButton("pay-button", {
    productName: "Bananas",
    orderAmount: 900,
    receiveAddress: DEV_WALLET_ADDRESS,
    createOrderEndpoint: YOUR_SERVER_URL + "create-order",
    redirectURI: YOUR_PAGE_URL,
    successCallback: (response) => {
        //
    },
});

```

Please see the examples in ./examples for more detail

## to dev

```bash
yarn install
cd examples/as-import && yarn install
# back to the root
cd ../../

# you need to create a symlink to use local files for the vue app test
yarn build
npm link
cd ./examples/as-import/ && npm link dotwallet-js

# back to the root
cd ../../
yarn dev:module
# or
yarn dev:main
```
